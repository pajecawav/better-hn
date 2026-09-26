import { useHead, type IslandProps } from "@pajecawav/yamf";
import { useEffect, useRef, useState } from "hono/jsx";
import useSWRInfinite, { type SWRInfiniteKeyLoader } from "swr/infinite";
import { FeedItem } from "~/components/FeedItem";
import { ChevronDownIcon } from "~/components/icons/ChevronDownIcon";
import {
	algoliaSearch,
	toTopicItem,
	RANGE_OPTIONS,
	type AlgoliaSearchResponse,
	type SearchRange,
	type SearchSort,
} from "~/lib/search";
import { buildPageTitle } from "~/lib/title";

const DEBOUNCE_MS = 300;

export interface SearchProps extends IslandProps {
	initialQuery: string;
	initialSort: SearchSort;
	initialRange: SearchRange;
}

const isSearchSort = (value: string): value is SearchSort =>
	value === "relevance" || value === "date";

const isSearchRange = (value: string): value is SearchRange =>
	value === "all" || value === "day" || value === "week" || value === "month" || value === "year";

/** SWR page key: the search state plus the zero-based page index. */
type SearchKey = readonly [query: string, sort: SearchSort, range: SearchRange, page: number];

export const Search = ({ initialQuery, initialSort, initialRange }: SearchProps) => {
	const [query, setQuery] = useState(initialQuery);
	const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
	const [sort, setSort] = useState<SearchSort>(initialSort);
	const [range, setRange] = useState<SearchRange>(initialRange);
	const inputRef = useRef<HTMLInputElement>(null);

	// Native `autofocus` is lost when hono re-mounts nodes during hydration,
	// so focus the input imperatively after hydration settles (a layout
	// effect would still fire before the re-mounted nodes are in place).
	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useHead({ title: buildPageTitle(debouncedQuery ? `Search: ${debouncedQuery}` : "Search") });

	// Debounce the raw input into the committed query.
	useEffect(() => {
		const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
		return () => clearTimeout(timer);
	}, [query]);

	const getKey: SWRInfiniteKeyLoader<AlgoliaSearchResponse, SearchKey | null> = (
		pageIndex,
		previousPage,
	) => {
		if (previousPage && pageIndex >= previousPage.nbPages) {
			return null; // reached the last page
		}
		return [debouncedQuery, sort, range, pageIndex];
	};

	const { data, error, isLoading, isValidating, mutate, size, setSize } = useSWRInfinite(
		getKey,
		([q, s, r, p]) => algoliaSearch({ query: q, sort: s, range: r, page: p }),
		{ revalidateOnFocus: false },
	);

	// Keep the URL shareable: q/sort/range mirror the committed state.
	useEffect(() => {
		const params = new URLSearchParams();
		if (debouncedQuery) {
			params.set("q", debouncedQuery);
		}
		if (sort !== "relevance") {
			params.set("sort", sort);
		}
		if (range !== "all") {
			params.set("range", range);
		}
		const search = params.toString();
		history.replaceState(null, "", search ? `/search?${search}` : "/search");
	}, [debouncedQuery, sort, range]);

	const pages = data ?? [];
	const hits = pages.flatMap(page => page.hits.map(toTopicItem));
	const lastPage = pages[pages.length - 1];
	const isReachingEnd = !lastPage || size >= lastPage.nbPages;
	const isLoadingMore = isValidating && pages.length < size;

	return (
		<div className="search" data-testid="search">
			<form className="searchBox" role="search" onSubmit={event => event.preventDefault()}>
				<div className="input">
					<input
						ref={inputRef}
						type="search"
						value={query}
						onInput={event => setQuery((event.target as HTMLInputElement).value)}
						placeholder="Search Hacker News…"
						aria-label="Search Hacker News"
						data-testid="search-input"
					/>
				</div>
				<div className="select">
					<select
						value={range}
						onChange={event => {
							const value = (event.target as HTMLSelectElement).value;
							if (isSearchRange(value)) {
								setRange(value);
							}
						}}
						aria-label="Filter by time range"
						data-testid="range-select"
					>
						{RANGE_OPTIONS.map(option => (
							<option value={option.value}>{option.label}</option>
						))}
					</select>
					<span className="chevron" aria-hidden="true">
						<ChevronDownIcon />
					</span>
				</div>
				<div className="select">
					<select
						value={sort}
						onChange={event => {
							const value = (event.target as HTMLSelectElement).value;
							if (isSearchSort(value)) {
								setSort(value);
							}
						}}
						aria-label="Sort results"
						data-testid="sort-select"
					>
						<option value="relevance">Relevance</option>
						<option value="date">Date</option>
					</select>
					<span className="chevron" aria-hidden="true">
						<ChevronDownIcon />
					</span>
				</div>
			</form>

			{isLoading && (
				<p className="status" data-testid="search-loading">
					<span className="spinner" aria-hidden="true" />
					Loading…
				</p>
			)}

			{!isLoading && error && (
				<p className="status" data-testid="search-error">
					Search failed.{" "}
					<button className="retry" type="button" onClick={() => void mutate()}>
						Try again
					</button>
				</p>
			)}

			{!isLoading && !error && hits.length === 0 && (
				<p className="status" data-testid="search-empty">
					No results found{debouncedQuery && ` for “${debouncedQuery}”`}
				</p>
			)}

			{!error && hits.length > 0 && (
				<>
					<div className="feed" data-testid="search-feed">
						{hits.map((item, index) => (
							<FeedItem item={item} index={index + 1} />
						))}
					</div>

					{!isReachingEnd && (
						<button
							className="more"
							type="button"
							disabled={isLoadingMore}
							onClick={() => void setSize(size + 1)}
							data-testid="search-more"
						>
							{isLoadingMore ? "Loading…" : "More..."}
						</button>
					)}
				</>
			)}
		</div>
	);
};

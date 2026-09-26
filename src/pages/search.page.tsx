import { definePage } from "@pajecawav/yamf";
import { Search } from "~/components/Search.island";
import { type SearchRange, type SearchSort } from "~/lib/search";
import { buildPageTitle } from "~/lib/title";

export default definePage({
	render: (event, { head }) => {
		const initialQuery = event.url.searchParams.get("q") ?? "";
		const sortParam = event.url.searchParams.get("sort");
		const rangeParam = event.url.searchParams.get("range");
		const initialSort: SearchSort = sortParam === "date" ? "date" : "relevance";
		const initialRange: SearchRange =
			rangeParam === "day" ||
			rangeParam === "week" ||
			rangeParam === "month" ||
			rangeParam === "year"
				? rangeParam
				: "all";

		// The shell is static — all Algolia traffic happens client-side in the island.
		event.res.headers.set("cache-control", "public, max-age=60, stale-while-revalidate=10");

		head.push({
			title: buildPageTitle(initialQuery ? `Search: ${initialQuery}` : "Search"),
		});

		return (
			<Search
				initialQuery={initialQuery}
				initialSort={initialSort}
				initialRange={initialRange}
				yamf-client="load"
			/>
		);
	},
});

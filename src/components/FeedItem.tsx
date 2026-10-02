import type { TopicItem } from "~/lib/topic";

interface FeedItemProps {
	item: TopicItem;
	index: number;
}

/** Algolia highlight markup is pre-escaped; plain titles must be escaped before injection. */
const escapeHtml = (text: string): string =>
	text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const FeedItem = ({ item, index }: FeedItemProps) => {
	return (
		<>
			<span className="index">{index}</span>
			<div className="item" data-testid="feed-item">
				<h2>
					<a href={item.domain ? item.url! : `/post/${item.id}`} className="link">
						{/*
							Keep the title as one stable element: hono's DOM patcher reuses
							nodes by tag, so toggling between a dangerouslySetInnerHTML span
							and plain text lets the old innerHTML (<em> highlights) survive
							into unrelated nodes. A constant span shape is always re-assigned.
						*/}
						<span
							className="titleHtml"
							dangerouslySetInnerHTML={{
								__html: item.title_html ?? escapeHtml(item.title),
							}}
						/>{" "}
						{item.domain && <span className="domain">({item.domain})</span>}
					</a>
				</h2>
				{item.type === "job" ? (
					<p className="info">{item.time_ago}</p>
				) : (
					<p className="info">
						{item.points} points by <a href={`/user/${item.user}`}>{item.user}</a>{" "}
						{item.time_ago}
						{" | "}
						<a href={`/post/${item.id}`} data-prefetch>
							{item.comments_count}&nbsp;
							{item.comments_count === 1 ? "comment" : "comments"}
						</a>
					</p>
				)}
			</div>
		</>
	);
};

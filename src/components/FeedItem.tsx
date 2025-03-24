import { TopicItem } from "~/lib/topic";

interface FeedItemProps {
	item: TopicItem;
	index: number;
}

export const FeedItem = ({ item, index }: FeedItemProps) => {
	return (
		<>
			<span className="index">{index}</span>
			<div className="item">
				<h2>
					<a href={item.domain ? item.url! : `/post/${item.id}`} className="link">
						{item.title}{" "}
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

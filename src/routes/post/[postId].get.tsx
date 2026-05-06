import { ServerTiming } from "tiny-server-timing";
import { Comment } from "~/components/Comment";
import { Link } from "~/components/Link";
import { replaceHnPostLinks } from "~/lib/link";
import { Post } from "~/lib/post";
import { renderPage } from "~/render";

export default defineEventHandler(async event => {
	const postId = Number(getRouterParam(event, "postId"));

	if (Number.isNaN(postId)) {
		throw createError({ statusCode: 404, message: "Post not found" });
	}

	setHeader(event, "cache-control", "public, max-age=60, stale-while-revalidate=10");

	const timing = new ServerTiming();

	const post = await timing.timeAsync("fetch", () =>
		$fetch<Post>(`https://bhn-api.pajecawav.workers.dev/item/${postId}`),
	);

	if (!post) {
		throw createError({ statusCode: 404, message: "Post not found" });
	}

	const url = post.url.startsWith("http") ? post.url : `/item/${post.id}`;

	return renderPage(
		<>
			<>
				<div class="post">
					<article class="item">
						<Link href={url}>
							<h1 class="title">{post.title}</h1>
							{post.domain && <span class="domain"> ({post.domain})</span>}
						</Link>

						<p class="info">
							{typeof post.points === "number" && <>{post.points} points by </>}
							<Link href={`/user/${post.user}`}>{post.user}</Link> {post.time_ago}
							{post.parent && (
								<>
									{" | "}
									<Link href={`/post/${post.parent}`}>parent</Link>
								</>
							)}{" "}
							| {post.comments_count}{" "}
							{post.comments_count === 1 ? "comment" : "comments"}
						</p>

						{post.content && (
							<div
								class="content"
								dangerouslySetInnerHTML={{
									__html: replaceHnPostLinks(post.content),
								}}
							/>
						)}
					</article>
				</div>

				{post.comments.map((comment, index) => (
					<Comment
						comment={comment}
						rootId={comment.id}
						prevId={post.comments[index - 1]?.id}
						nextId={post.comments[index + 1]?.id}
					/>
				))}
			</>
		</>,
		{ title: post.title, event, timing },
	);
});

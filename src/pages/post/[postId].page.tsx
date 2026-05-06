import { definePage } from "@pajecawav/yamf";
import { HTTPError } from "nitro";
import { withServerTiming } from "nitro/h3";
import { $fetch } from "ofetch";
import { Comment } from "~/components/Comment";
import { Link } from "~/components/Link";
import { replaceHnPostLinks } from "~/lib/link";
import type { Post } from "~/lib/post";
import { htmlToText, jsonLdScript, postJsonLd, seoHead } from "~/lib/seo";
import { buildPageTitle } from "~/lib/title";

export default definePage({
	render: async (event, { head }) => {
		const postId = Number(event.context.params?.postId);

		if (Number.isNaN(postId)) {
			throw new HTTPError({ statusCode: 404, message: "Post not found" });
		}

		event.res.headers.set("cache-control", "public, max-age=60, stale-while-revalidate=10");

		const post = await withServerTiming(event, "fetch", () =>
			$fetch<Post>(`https://api.bhn.pajecawav.dev/item/${postId}`),
		);

		// The API answers 200 with an {error} stub for unknown ids
		if (!post || !post.id) {
			throw new HTTPError({ statusCode: 404, message: "Post not found" });
		}

		const url = post.url.startsWith("http") ? post.url : `/item/${post.id}`;
		const publishedTime = new Date(post.time * 1000).toISOString();
		const stats = [
			typeof post.points === "number" && `${post.points} points`,
			`${post.comments_count} ${post.comments_count === 1 ? "comment" : "comments"}`,
		]
			.filter(Boolean)
			.join(" · ");
		const description = [
			stats,
			post.content
				? htmlToText(post.content).slice(0, 160)
				: `Discussion of "${post.title}" on Hacker News`,
		].join(" — ");

		head.push(
			seoHead({
				title: buildPageTitle(post.title),
				description,
				path: `/post/${post.id}`,
				ogType: "article",
				publishedTime,
			}),
		);

		head.push({
			script: [
				{
					type: "application/ld+json",
					innerHTML: jsonLdScript(postJsonLd(post, post.comments_count)),
				},
			],
		});

		return (
			<>
				<div class="post" data-testid="post">
					<article class="item">
						<Link href={url}>
							<h1 class="title" data-testid="post-title">
								{post.title}
							</h1>
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
		);
	},
});

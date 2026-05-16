import { definePage } from "@pajecawav/yamf";
import { HTTPError } from "nitro";
import { $fetch } from "ofetch";
import { Comment } from "~/components/Comment";
import { Link } from "~/components/Link";
import { replaceHnPostLinks } from "~/lib/link";
import type { Post, Comment as TComment } from "~/lib/post";
import { buildPageTitle } from "~/lib/title";

export default definePage({
	render: async (event, { head }) => {
		const postId = Number(event.context.params?.postId);

		if (Number.isNaN(postId)) {
			throw new HTTPError({ statusCode: 404, message: "Post not found" });
		}

		event.res.headers.set("cache-control", "public, max-age=60, stale-while-revalidate=10");

		// const post = await $fetch<Post>(`https://api.hnpwa.com/v0/item/${postId}.json`),
		const post = await $fetch<Post>(`https://api.hackerwebapp.com/item/${postId}`);

		if (!post) {
			throw new HTTPError({ statusCode: 404, message: "Post not found" });
		}

		head.push({
			title: buildPageTitle(post.title),
		});

		// oxlint-disable-next-line unicorn/consistent-function-scoping
		const fillCommentsCount = (item: Post | TComment) => {
			let count = item.comments.length;

			for (const comment of item.comments ?? []) {
				count += fillCommentsCount(comment);
			}

			item.comments_count = count;

			return count;
		};

		fillCommentsCount(post);

		const url = post.url.startsWith("http") ? post.url : `/item/${post.id}`;

		return (
			<>
				<div class="post">
					<article class="item">
						<Link href={url}>
							<h1 class="title">{post.title}</h1>
							{post.domain && <span class="domain"> ({post.domain})</span>}
						</Link>

						<p class="info">
							{post.points} points by{" "}
							<Link href={`/user/${post.user}`}>{post.user}</Link> {post.time_ago} |{" "}
							{post.comments_count}{" "}
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

import { replaceHnPostLinks } from "~/lib/link";
import { Comment as CommentType } from "~/lib/post";
import { Link } from "./Link";

interface CommentProps {
	comment: CommentType;
	rootId: number;
	parentId?: number;
	prevId?: number;
	nextId?: number;
}

export const Comment = ({ comment, rootId, parentId, prevId, nextId }: CommentProps) => {
	const commentLink = (id: number) => `#comment-${id}`;

	const content = replaceHnPostLinks(comment.content);

	return (
		<article
			id={`comment-${comment.id}`}
			class="comment"
			// data-rootid={rootId}
			// data-parentid={parentId}
			// data-nextid={nextId}
			// data-previd={prevId}
			// data-childid={comment.comments[0]?.id ?? undefined}
		>
			<div class="commentBody" tabindex={-1}>
				<p class="info">
					{comment.user && (
						<Link class="user commentUser" href={`/user/${comment.user}`}>
							{comment.user}
						</Link>
					)}{" "}
					<Link href={commentLink(comment.id)}>{comment.time_ago}</Link>
					{rootId && rootId !== comment.id && (
						<>
							{" | "}
							<Link href={commentLink(rootId)}>root</Link>
						</>
					)}
					{parentId && (
						<>
							{" | "}
							<Link href={commentLink(parentId)}>parent</Link>
						</>
					)}
					{prevId && (
						<>
							{" | "}
							<Link href={commentLink(prevId)}>prev</Link>
						</>
					)}
					{nextId && (
						<>
							{" | "}
							<Link href={commentLink(nextId)}>next</Link>
						</>
					)}
					{" | "}
					<button onclick={`Comments.toggleComment(${comment.id})`}>
						<span class="fold">[–]</span>
						<span class="unfold">[{comment.comments_count + 1} more]</span>
					</button>
				</p>

				<div class="content" dangerouslySetInnerHTML={{ __html: content }} />
			</div>

			<div class="repliesContainer">
				<button
					class="foldButton"
					aria-label="Fold comment"
					tabindex={-1}
					onclick={`Comments.toggleComment(${comment.id})`}
				/>
				<div class="replies">
					{comment.comments.map((reply, index) => (
						<Comment
							comment={reply}
							rootId={rootId}
							parentId={comment.id}
							prevId={comment.comments[index - 1]?.id}
							nextId={comment.comments[index + 1]?.id}
						/>
					))}
				</div>
			</div>
		</article>
	);
};

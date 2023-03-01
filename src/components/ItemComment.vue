<template>
	<article :id="comment.id.toString()" :class="$style.comment">
		<p :class="$style.info">
			<NuxtLink :class="$style.user" :to="`/user/${comment.user}`">{{
				comment.user
			}}</NuxtLink>

			{{ " " }}<CommentLink :id="comment.id">{{ comment.time_ago }}</CommentLink>

			<template v-if="rootId && rootId !== comment.id">
				{{ " | " }}<CommentLink :id="rootId">root</CommentLink>
			</template>

			<template v-if="parentId">
				{{ " | " }}<CommentLink :id="parentId">parent</CommentLink>
			</template>

			<template v-if="prevId">
				{{ " | " }}<CommentLink :id="prevId">prev</CommentLink>
			</template>

			<template v-if="nextId">
				{{ " | " }}<CommentLink :id="nextId">next</CommentLink>
			</template>

			{{ " | " }}
			<button
				:title="isFolded ? 'Unfold comment' : 'Fold comment'"
				@click="isFolded = !isFolded"
			>
				{{ isFolded ? `[${comment.comments_count + 1} more]` : "[–]" }}
			</button>
		</p>

		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-show="!isFolded" :class="$style.content" v-html="comment.content" />

		<div v-show="!isFolded" :class="$style.replies">
			<ItemComment
				v-for="(reply, index) of comment.comments"
				:key="reply.id"
				:comment="reply"
				:parent-id="comment.id"
				:root-id="rootId"
				:prev-id="comment.comments[index - 1]?.id"
				:next-id="comment.comments[index + 1]?.id"
			/>
		</div>
	</article>
</template>

<script setup lang="ts">
import { Comment } from "../lib/item";

const props = defineProps<{
	comment: Comment;
	rootId?: number;
	parentId?: number;
	prevId?: number;
	nextId?: number;
}>();
const { comment, parentId, prevId, nextId } = toRefs(props);

const isFolded = ref(false);
</script>

<style module lang="scss">
:global html {
	scroll-behavior: smooth;
}

.comment {
	margin-block: var(--size-4);
	border-top: 2px solid var(--neutral-200);

	:global(.dark) & {
		border-color: var(--neutral-700);
	}
}

.info {
	color: var(--neutral-400);
	margin-block: var(--size-4);

	.user,
	a:hover {
		text-decoration: underline;
	}
}

.content {
	overflow-wrap: break-word;

	p {
		margin-block: var(--size-2);
	}

	a {
		text-decoration: underline;
	}

	pre {
		overflow-x: auto;
		font-size: var(--font-size-sm);
	}
}

.replies {
	margin-left: var(--size-8);
}
</style>

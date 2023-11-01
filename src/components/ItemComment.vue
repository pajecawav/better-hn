<template>
	<article
		:id="`comment-${comment.id}`"
		:class="[$style.comment, 'comment']"
		:data-rootid="rootId"
		:data-parentid="parentId"
		:data-nextid="nextId"
		:data-previd="prevId"
		:data-childid="comment.comments[0]?.id ?? undefined"
	>
		<div class="commentBody" :tabindex="-1">
			<p ref="infoRef" :class="$style.info">
				<NuxtLink
					v-if="comment.user"
					:class="[$style.user, 'commentUser']"
					:to="`/user/${comment.user}`"
					>{{ comment.user }}</NuxtLink
				>

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
					class="foldToggle"
					@click="isFolded = !isFolded"
				>
					{{ isFolded ? `[${comment.comments_count + 1} more]` : "[–]" }}
				</button>
			</p>

			<!-- eslint-disable-next-line vue/no-v-html -->
			<div v-show="!isFolded" :class="$style.content" v-html="comment.content" />
		</div>

		<div v-show="!isFolded" :class="$style.repliesContainer">
			<button
				:class="$style.foldButton"
				aria-label="Fold comment"
				tabindex="-1"
				@click="foldWithScroll"
			/>
			<div :class="$style.replies">
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
		</div>
	</article>
</template>

<script setup lang="ts">
import type { Comment } from "../lib/item";

const props = defineProps<{
	comment: Comment;
	rootId?: number;
	parentId?: number;
	prevId?: number;
	nextId?: number;
}>();
const { comment, parentId, prevId, nextId } = toRefs(props);

const infoRef = ref<HTMLElement | null>(null);

const isFolded = ref(false);

function foldWithScroll() {
	isFolded.value = true;
	infoRef.value?.scrollIntoView({ block: "nearest" });
}
</script>

<style module lang="scss">
.comment {
	&:not(:first-child) {
		margin-top: var(--size-2);
	}
}

:global(.commentBody) {
	outline-offset: 5px;
}

.info {
	color: var(--neutral-400);

	.user,
	a:hover {
		text-decoration: underline;
	}
}

.content {
	overflow-wrap: anywhere;

	p,
	pre {
		margin-block: var(--size-2);
	}

	a {
		text-decoration: underline;
	}

	pre {
		overflow-x: auto;
		white-space: pre-wrap;
		font-size: var(--font-size-sm);
	}
}

.repliesContainer {
	display: flex;

	> .foldButton {
		flex: 0;
		min-width: var(--size-8);
		border-left: 2px dashed var(--neutral-200);
		transition: border-color 100ms;

		:global(.dark) & {
			border-color: var(--neutral-700);
		}

		&:hover {
			border-color: var(--orange-200);
		}

		:global(.dark) &:hover {
			border-color: var(--neutral-400);
		}

		@media (max-width: 639px) {
			& {
				min-width: var(--size-6);
			}
		}
	}
}
</style>

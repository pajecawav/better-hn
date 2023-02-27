<template>
	<article :class="$style.comment">
		<p :class="$style.info">
			<NuxtLink :to="`/user/${comment.user}`">{{ comment.user }}</NuxtLink>
			{{ comment.time_ago }}
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
			<ItemComment v-for="reply of comment.comments" :key="reply.id" :comment="reply" />
		</div>
	</article>
</template>

<script setup lang="ts">
import { Comment } from "../lib/item";

const props = defineProps<{ comment: Comment }>();
const { comment } = toRefs(props);

const isFolded = ref(false);
</script>

<style module lang="scss">
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

	a {
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
}

.replies {
	margin-left: var(--size-8);
}
</style>

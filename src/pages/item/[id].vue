<template>
	<ErrorMessage v-if="!item">Item not found.</ErrorMessage>

	<template v-else>
		<article :class="$style.item">
			<NuxtLink :to="formatUrl(item.url)">
				<h1 :class="$style.title">{{ item.title }}</h1>
				<span v-if="item.domain" :class="$style.domain"> ({{ item.domain }})</span>
			</NuxtLink>

			<p :class="$style.info">
				{{ item.points }} points by
				<NuxtLink :to="`/user/${item.user}`">{{ item.user }}</NuxtLink>
				{{ item.time_ago }} | {{ item.comments_count }}
				{{ item.comments_count === 1 ? "comment" : "comments" }}
			</p>

			<!-- eslint-disable-next-line vue/no-v-html -->
			<div v-if="item.content" :class="$style.content" v-html="item.content" />
		</article>

		<ItemComment
			v-for="(comment, index) of item.comments"
			:key="comment.id"
			:comment="comment"
			:root-id="comment.id"
			:prev-id="item.comments[index - 1]?.id"
			:next-id="item.comments[index + 1]?.id"
		/>
	</template>
</template>

<script setup lang="ts">
definePageMeta({
	key: route => route.params.id as string,
});

const route = useRoute();
const id = route.params.id as string;
const { data: item } = await useFetch(`/api/items/${id}`);

useHead({ title: () => item.value?.title ?? null });

function formatUrl(url: string): string {
	if (url.startsWith("http")) return url;
	return `/item/${id}`;
}
</script>

<style module lang="scss">
.item {
	margin-bottom: var(--size-4);

	& p:not(.info) {
		margin-block: var(--size-2);
	}
}

.title {
	font-size: var(--font-size-2xl);
	font-weight: 500;
	display: inline;
}

.domain {
	font-size: var(--font-size-xl);
}

.domain,
.info {
	color: var(--neutral-400);
}

.info {
	margin-top: var(--size-1);

	a {
		text-decoration: underline;
	}
}

.content {
	overflow-wrap: break-word;
	border-bottom: 2px solid var(--neutral-200);

	a {
		text-decoration: underline;
	}

	pre {
		overflow-x: auto;
	}

	:global(.dark) & {
		border-color: var(--neutral-700);
	}
}
</style>

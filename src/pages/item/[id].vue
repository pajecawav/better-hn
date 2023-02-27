<template>
	<ErrorMessage v-if="!post">Post not found.</ErrorMessage>

	<template v-else>
		<article :class="$style.post">
			<NuxtLink :to="formatUrl(post.url)">
				<h1 :class="$style.title">{{ post.title }}</h1>
				<span v-if="post.domain" :class="$style.domain"> ({{ post.domain }})</span>
			</NuxtLink>

			<p :class="$style.info">
				{{ post.points }} points by
				<NuxtLink :to="`/user/${post.user}`">{{ post.user }}</NuxtLink> {{ post.time_ago }}
			</p>

			<!-- eslint-disable-next-line vue/no-v-html -->
			<div v-if="post.content" v-html="post.content" />
		</article>
	</template>
</template>

<script setup lang="ts">
definePageMeta({
	key: route => route.params.id as string,
});

const route = useRoute();
const id = route.params.id as string;
const { data: post } = await useFetch(`/api/posts/${id}`);

function formatUrl(url: string): string {
	if (url.startsWith("http")) return url;
	return `/item/${id}`;
}
</script>

<style module lang="scss">
.post {
	border-bottom: 2px solid var(--neutral-200);

	:global(.dark) & {
		border-bottom: 2px solid var(--neutral-700);
	}

	& p:not(.info) {
		margin-block: var(--size-4);
	}
}

.title {
	font-size: var(--font-size-2xl);
	font-weight: 500;
	display: inline-block;
	margin-bottom: var(--size-2);
}

.domain,
.info {
	color: var(--neutral-400);
}

.info {
	a {
		text-decoration: underline;
	}
}
</style>

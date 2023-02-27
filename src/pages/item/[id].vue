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
				<NuxtLink :to="`/user/${item.user}`">{{ item.user }}</NuxtLink> {{ item.time_ago }}
			</p>

			<!-- eslint-disable-next-line vue/no-v-html -->
			<div v-if="item.content" :class="$style.content" v-html="item.content" />
		</article>

		<ItemComment v-for="comment of item.comments" :key="comment.id" :comment="comment" />
	</template>
</template>

<script setup lang="ts">
definePageMeta({
	key: route => route.params.id as string,
});

const route = useRoute();
const id = route.params.id as string;
const { data: item } = await useFetch(`/api/items/${id}`);

useHead({ title: item.value?.title });

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
	margin-bottom: var(--size-2);
}

.domain {
	font-size: var(--font-size-xl);
}

.domain,
.info {
	color: var(--neutral-400);
}

.info {
	margin-bottom: var(--size-4);

	a {
		text-decoration: underline;
	}
}

.content {
	overflow-wrap: break-word;

	a {
		text-decoration: underline;
	}
}
</style>

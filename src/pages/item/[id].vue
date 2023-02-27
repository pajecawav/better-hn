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
			<div v-if="item.content" v-html="item.content" />
		</article>
	</template>
</template>

<script setup lang="ts">
definePageMeta({
	key: route => route.params.id as string,
});

const route = useRoute();
const id = route.params.id as string;
const { data: item } = await useFetch(`/api/items/${id}`);

function formatUrl(url: string): string {
	if (url.startsWith("http")) return url;
	return `/item/${id}`;
}
</script>

<style module lang="scss">
.item {
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

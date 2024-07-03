<template>
	<ErrorMessage v-if="!items">Failed to load items.</ErrorMessage>

	<template v-else>
		<div :class="$style.list">
			<template v-for="(item, index) of items" :key="item.id">
				<span :class="$style.index">{{ startIndex + index }}</span>
				<div :class="[$style.item, 'item']" :tabindex="-1" @focusin="selectedIndex = index">
					<h2>
						<NuxtLink
							:to="item.domain ? item.url : `/item/${item.id}`"
							class="itemLink"
						>
							{{ item.title }}
							<span v-if="item.domain" :class="$style.domain"
								>({{ item.domain }})</span
							>
						</NuxtLink>
					</h2>

					<p v-if="item.type === 'job'" :class="$style.info">{{ item.time_ago }}</p>
					<p v-else :class="$style.info">
						{{ item.points }} points by
						<NuxtLink :to="`/user/${item.user}`">{{ item.user }}</NuxtLink>
						{{ item.time_ago }} |
						<NuxtLink :to="`/item/${item.id}`"
							>{{ item.comments_count }}
							{{ item.comments_count === 1 ? "comment" : "comments" }}</NuxtLink
						>
					</p>
				</div>
			</template>
		</div>

		<NuxtLink :to="{ path: `/${topic}`, query: { page: page + 1 } }" :class="$style.moreLink"
			>More...</NuxtLink
		>
	</template>
</template>

<script setup lang="ts">
import { TOPICS, type FeedItem } from "../lib/items";

definePageMeta({
	scrollToTop: true,
});

const ITEMS_PER_PAGE = 30;

const route = useRoute();
const topic = TOPICS[route.params.topic as keyof typeof TOPICS];
const page = Math.max(1, +(route.query.page ?? "1") || 1);

if (!topic) {
	throw createError({ statusCode: 404 });
}

const { data: items } = await useFetch<FeedItem[]>(
	`https://api.hnpwa.com/v0/${topic}/${page}.json`,
);
const startIndex = computed(() => 1 + (page - 1) * ITEMS_PER_PAGE);

const selectedIndex = ref<number>(-1);
</script>

<style module lang="scss">
.list {
	display: grid;
	grid-template-columns: max-content 1fr;
	row-gap: var(--size-4);
	column-gap: var(--size-6);

	font-size: var(--font-size-lg);
}

.index {
	font-size: var(--font-size-2xl);
	text-align: right;
}

.item {
	outline-offset: 5px;
}

:global(.itemLink):visited,
.index,
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

.moreLink {
	display: block;
	margin-top: var(--size-4);
	text-decoration: underline;
}
</style>

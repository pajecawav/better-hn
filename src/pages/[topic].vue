<template>
	<ErrorMessage v-if="!data">Failed to load items.</ErrorMessage>

	<template v-else>
		<div :class="$style.list">
			<template v-for="(item, index) of data.items" :key="item.id">
				<span :class="$style.index">{{ startIndex + index }}</span>
				<div :class="$style.item">
					<h2>
						<NuxtLink :to="item.domain ? item.url : `/item/${item.id}`">
							{{ item.title }}
							<span v-if="item.domain" :class="$style.domain"
								>({{ item.domain }})</span
							>
						</NuxtLink>
					</h2>
					<p :class="$style.info">
						{{ item.points }} points by
						<NuxtLink v-if="item.user" :to="`/user/${item.user}`">{{
							item.user
						}}</NuxtLink>
						{{ item.time_ago }} |
						<NuxtLink :to="`/item/${item.id}`"
							>{{ item.comments_count }} comments</NuxtLink
						>
					</p>
				</div>
			</template>
		</div>

		<NuxtLink
			:to="{ path: `/${data.topic}`, query: { page: data.page + 1 } }"
			:class="$style.moreLink"
			>More...</NuxtLink
		>
	</template>
</template>

<script setup lang="ts">
import { TOPICS } from "../lib/items";

definePageMeta({
	validate: route => {
		return Object.keys(TOPICS).includes(route.params.topic as string);
	},
	key: route => route.fullPath,
	scrollToTop: true,
});

const ITEMS_PER_PAGE = 30;

const route = useRoute();

const { data } = await useFetch("/api/items", {
	params: computed(() => ({ topic: route.params.topic, page: route.query.page })),
});

const startIndex = computed(() => 1 + ((data.value?.page ?? 1) - 1) * ITEMS_PER_PAGE);
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

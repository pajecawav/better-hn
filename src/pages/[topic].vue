<template>
	<ul :class="$style.list">
		<li v-for="item of items" :key="item.id" :class="$style.item">
			<h2>
				<NuxtLink :to="item.domain ? item.url : `/item/${item.id}`">
					{{ item.title }}
					<span v-if="item.domain" :class="$style.domain">({{ item.domain }})</span>
				</NuxtLink>
			</h2>
			<p :class="$style.info">
				{{ item.points }} points by
				<NuxtLink :to="`/user/${item.user}`">{{ item.user }}</NuxtLink>
				{{ item.time_ago }} |
				<NuxtLink :to="`/item/${item.id}`">{{ item.comments_count }} comments</NuxtLink>
			</p>
		</li>
	</ul>
</template>

<script setup lang="ts">
import { TOPICS } from "../lib/topics";

definePageMeta({
	validate: route => {
		return Object.keys(TOPICS).includes(route.params.topic as string);
	},
});

const route = useRoute();

const { data: items } = await useFetch("/api/topic", {
	params: computed(() => ({ topic: route.params.topic, page: route.query.page })),
});
</script>

<style module lang="scss">
.list {
	display: flex;
	flex-direction: column;
	gap: var(--size-6);

	counter-reset: item;
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
</style>

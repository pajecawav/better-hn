<template>
	<ErrorMessage v-if="!data">Failed to load items.</ErrorMessage>

	<template v-else>
		<div :class="$style.list">
			<template v-for="(item, index) of data.items" :key="item.id">
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

const selectedIndex = ref<number>(-1);

function focusSelectedItem() {
	const urls = document.querySelectorAll<HTMLAnchorElement>(".item");
	urls.item(selectedIndex.value)?.focus();
}

function selectNextItem() {
	selectedIndex.value = Math.min(selectedIndex.value + 1, ITEMS_PER_PAGE - 1);
	focusSelectedItem();
}

function selectPrevItem() {
	selectedIndex.value = Math.max(0, selectedIndex.value - 1);
	focusSelectedItem();
}

function openLink(newTab: boolean) {
	if (selectedIndex.value === null) return;

	const item = data.value?.items[selectedIndex.value];
	if (!item) return;

	const itemPath = `/item/${item.id}`;
	if (item.domain) {
		const target = newTab ? "_blank" : "_self";
		window.open(item.url, target, "noopener,noreferrer");
	} else if (newTab) {
		window.open(itemPath, "_blank", "noopener,noreferrer");
	} else {
		navigateTo({ path: itemPath });
	}
}

function openComments(newTab: boolean) {
	if (selectedIndex.value === null) return;

	const id = data.value?.items[selectedIndex.value].id;
	if (!id) return;

	const path = `/item/${id}`;
	if (newTab) {
		window.open(path, "_blank", "noopener,noreferrer");
	} else {
		navigateTo({ path });
	}
}

function openUser(newTab: boolean) {
	if (selectedIndex.value === null) return;

	const user = data.value?.items[selectedIndex.value].user;
	if (!user) return;

	const path = `/user/${user}`;
	if (newTab) {
		window.open(path, "_blank", "noopener,noreferrer");
	} else {
		navigateTo({ path });
	}
}

useHotkeys({
	j: selectNextItem,
	k: selectPrevItem,
	o: () => openLink(false),
	O: () => openLink(true),
	c: () => openComments(false),
	C: () => openComments(true),
	u: () => openUser(false),
	U: () => openUser(true),
});
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

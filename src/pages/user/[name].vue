<template>
	<ErrorMessage v-if="!user">Failed to load user.</ErrorMessage>

	<template v-else>
		<h1 :class="$style.name">{{ user.id }}</h1>
		<div :class="$style.info">
			<span>Created:</span><span> {{ user?.created }}</span>

			<span>Karma:</span> <span> {{ user?.karma }}</span>
		</div>

		<p :class="$style.links">
			<NuxtLink :to="`https://news.ycombinator.com/submitted?id=${user.id}`"
				>submissions</NuxtLink
			>
			/
			<NuxtLink :to="`https://news.ycombinator.com/threads?id=${user.id}`">comments</NuxtLink>
			/
			<NuxtLink :to="`https://news.ycombinator.com/favorites?id=${user.id}`"
				>favorites</NuxtLink
			>
		</p>

		<!-- eslint-disable-next-line vue/no-v-html -->
		<div v-if="user.about" :class="$style.about" v-html="user.about" />
	</template>
</template>

<script setup lang="ts">
definePageMeta({
	key: route => route.params.name as string,
	alias: ["/u/:name"],
});

const route = useRoute();

const { data: user } = await useFetch(`/api/users/${route.params.name}`);

useHead({ title: user.value?.id });
</script>

<style module lang="scss">
.name {
	font-size: var(--font-size-2xl);
	font-weight: 600;
}

.info {
	display: grid;
	grid-template-columns: max-content 1fr;
	column-gap: var(--size-2);
}

.links {
	margin-block: var(--size-4);

	a {
		text-decoration: underline;
	}
}

.about {
	& p {
		margin-block: var(--size-4);
	}
}
</style>

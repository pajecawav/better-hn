<template>
	<div :class="$style.container">
		<Header />
		<slot />
	</div>
</template>

<script setup lang="ts">
useHead({
	// docs recommend using `titleTemplate` in the `app.vue` but it flashes
	// default title when `value` is provided from `useFetch` SSR response
	titleTemplate: value => (value ? `${value} | Better HN` : "Better HN"),
});
</script>

<style module>
.container {
	max-width: var(--size-screen-md);
	margin: 0 auto;
}
</style>

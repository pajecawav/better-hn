<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
useHead({
	titleTemplate: value => (value ? `${value} | Better HN` : "Better HN"),
});
</script>

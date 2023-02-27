<template>
	<h2>Item: {{ $route.params.id }}</h2>
</template>

<script setup lang="ts">
definePageMeta({
	key: route => route.params.id as string,
});
</script>

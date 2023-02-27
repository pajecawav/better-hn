<template>
	<h1>{{ $route.params.topic }}</h1>
</template>

<script setup lang="ts">
import { TOPICS } from "../lib/topics";

definePageMeta({
	validate: route => {
		return Object.keys(TOPICS).includes(route.params.topic as string);
	},
});
</script>

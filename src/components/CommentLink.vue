<template>
	<NuxtLink :to="{ hash: `#comment-${id}` }" :replace="true"><slot /></NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ id: number }>();
</script>

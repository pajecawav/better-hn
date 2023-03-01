<template>
	<NuxtLink :to="{ hash: `#${id}` }" :replace="true"><slot /></NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ id: number }>();
</script>

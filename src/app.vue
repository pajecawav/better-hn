<template>
	<NuxtLayout>
		<NuxtLoadingIndicator :color="false" />
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
const { themeColor } = useTheme();

useHead({
	meta: [{ name: "theme-color", content: themeColor }],
});
</script>

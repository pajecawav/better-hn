<template>
	<NuxtLayout>
		<NuxtLoadingIndicator :color="false" />
		<NuxtPage />
	</NuxtLayout>
	<Analytics />
</template>

<script setup lang="ts">
import { Analytics } from "@vercel/analytics/nuxt";

const { themeColor } = useTheme();

useHead({
	meta: [{ name: "theme-color", content: themeColor }],
});
</script>

<template>
	<NuxtLayout>
		<NuxtLoadingIndicator :color="false" />
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useHotkeys } from "./composables/useHotkeys";

const { toggleTheme } = useTheme();

useHotkeys({
	"g t": () => navigateTo("/top"),
	"g n": () => navigateTo("/new"),
	"g a": () => navigateTo("/ask"),
	"g s": () => navigateTo("/show"),

	"t t": toggleTheme,
});
</script>

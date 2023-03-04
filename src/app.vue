<template>
	<NuxtLayout>
		<NuxtLoadingIndicator :color="false" />
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useHotkeys } from "./composables/useHotkeys";

const router = useRouter();

const { toggleTheme } = useTheme();

useHotkeys({
	H: () => history.state.back && router.back(),
	L: () => history.state.forward && router.forward(),

	"g t": () => navigateTo("/top"),
	"g n": () => navigateTo("/new"),
	"g a": () => navigateTo("/ask"),
	"g s": () => navigateTo("/show"),

	"t t": toggleTheme,
});
</script>

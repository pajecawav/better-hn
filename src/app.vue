<template>
	<NuxtLayout>
		<NuxtLoadingIndicator :color="false" />
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import { useHotkeys } from "./composables/useHotkeys";
import { useSettings } from "./composables/useSettings";

const { themeColor, toggleTheme } = useTheme();

const router = useRouter();

useHead({
	meta: [{ name: "theme-color", content: themeColor }],
});

const { settings } = useSettings();

useHotkeys({
	H: () => history.state.back && router.back(),
	L: () => history.state.forward && router.forward(),

	"g t": () => navigateTo("/top"),
	"g n": () => navigateTo("/new"),
	"g a": () => navigateTo("/ask"),
	"g s": () => navigateTo("/show"),

	"t t": toggleTheme,
	"t h": () => (settings.value.hotkeysEnabled = !settings.value.hotkeysEnabled),
});
</script>

<template>
	<header :class="$style.header">
		<nav :class="$style.navigation">
			<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/top"
				>Top</NuxtLink
			>
			<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/new"
				>New</NuxtLink
			>
			<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/ask"
				>Ask</NuxtLink
			>
			<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/show"
				>Show</NuxtLink
			>
		</nav>

		<ClientOnly>
			<button
				:class="$style.icon_button"
				:title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
				@click="toggleTheme"
			>
				<component :is="theme == 'light' ? SunIcon : MoonIcon" />
			</button>
			<button
				:class="$style.icon_button"
				:title="settings.hotkeysEnabled ? 'Disable hotkeys' : 'Enable hotkeys'"
				@click="settings.hotkeysEnabled = !settings.hotkeysEnabled"
			>
				<component :is="settings.hotkeysEnabled ? Keyboard : KeyboardOff" />
			</button>
		</ClientOnly>
	</header>
</template>

<script setup lang="ts">
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import { useSettings } from "../composables/useSettings";
import KeyboardOff from "./icons/KeyboardOff.vue";
import Keyboard from "./icons/Keyboard.vue";

const { theme, toggleTheme } = useTheme();
const { settings } = useSettings();
</script>

<style module lang="scss">
.header {
	display: flex;
	align-items: center;
	gap: var(--size-1);

	padding: var(--size-2) 0;
	margin-bottom: var(--size-2);
}

.navigation {
	display: flex;
	align-items: center;
	gap: var(--size-2);
	margin-right: auto;
}

.link {
	padding: var(--size-1) var(--size-2);
	border-radius: var(--radius-md);
	transition: background-color 100ms;

	&:hover,
	&__active {
		background: var(--orange-200);
	}

	:global(.dark) :is(&:hover, &__active) {
		background: var(--neutral-800);
	}
}

.icon_button {
	width: var(--size-8);
	padding: var(--size-1);
	border-radius: var(--radius-md);
	transition: background-color 100ms;

	&:hover {
		background: var(--orange-200);
	}

	:global(.dark) &:hover {
		background: var(--neutral-800);
	}
}
</style>

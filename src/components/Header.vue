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
				v-if="shareUrl"
				:class="[$style.icon_button, $style.icon_button__mobile]"
				title="Share item"
				@click="share"
			>
				<PaperAirplaneIcon />
			</button>
			<a
				:class="$style.icon_button"
				title="Search Hacker News"
				href="https://hn.algolia.com"
				rel="noreferrer noopener"
			>
				<MagnifyingGlassIcon />
			</a>
			<button
				:class="$style.icon_button"
				:title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
				@click="toggleTheme"
			>
				<component :is="theme == 'light' ? SunIcon : MoonIcon" />
			</button>
			<button
				:class="[$style.icon_button, $style.icon_button__desktop]"
				:title="settings.hotkeysEnabled ? 'Disable hotkeys' : 'Enable hotkeys'"
				@click="settings.hotkeysEnabled = !settings.hotkeysEnabled"
			>
				<component :is="settings.hotkeysEnabled ? KeyboardIcon : KeyboardOffIcon" />
			</button>
			<a
				:class="$style.icon_button"
				title="Project source code"
				href="https://github.com/pajecawav/better-hn"
				rel="noreferrer noopener"
			>
				<GitHubIcon />
			</a>
		</ClientOnly>
	</header>
</template>

<script setup lang="ts">
import {
	MagnifyingGlassIcon,
	MoonIcon,
	PaperAirplaneIcon,
	SunIcon,
} from "@heroicons/vue/24/outline";
import { useSettings } from "../composables/useSettings";
import KeyboardOffIcon from "./icons/KeyboardOffIcon.vue";
import KeyboardIcon from "./icons/KeyboardIcon.vue";
import GitHubIcon from "./icons/GitHubIcon.vue";

const { theme, toggleTheme } = useTheme();
const { settings } = useSettings();

const route = useRoute();

const shareUrl = computed(() => {
	if (route.name !== "item-id") {
		return null;
	}

	if (!("share" in navigator)) {
		return null;
	}

	return route.fullPath;
});

function share() {
	if (shareUrl.value) {
		navigator.share({ url: shareUrl.value });
	}
}
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

	&__mobile {
		display: none;
	}

	@media (max-width: 639px) {
		&__desktop {
			display: none;
		}

		&__mobile {
			display: block;
		}
	}
}
</style>

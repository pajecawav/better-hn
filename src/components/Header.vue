<template>
	<header :class="$style.header">
		<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/top">Top</NuxtLink>
		<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/new">New</NuxtLink>
		<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/ask">Ask</NuxtLink>
		<NuxtLink :class="$style.link" :active-class="$style.link__active" to="/show"
			>Show</NuxtLink
		>

		<button
			:class="$style.icon_button"
			:title="`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`"
			@click="toggleTheme"
		>
			<component :is="theme == 'light' ? MoonIcon : SunIcon" />
		</button>
	</header>
</template>

<script setup lang="ts">
import { MoonIcon, SunIcon } from "@heroicons/vue/24/outline";

const { theme, toggleTheme } = useTheme();
</script>

<style module lang="scss">
.header {
	display: flex;
	align-items: center;
	gap: var(--size-2);

	padding: var(--size-2) 0;
}

.link {
	padding: var(--size-1) var(--size-2);
	border-radius: var(--radius-md);
	transition: 100ms;

	&:hover,
	&__active {
		background: var(--gray-100);
	}

	:global(.dark) :is(&:hover, &__active) {
		background: var(--neutral-800);
	}
}

.icon_button {
	width: var(--size-8);
	padding: var(--size-1);
	margin-left: auto;
	border-radius: var(--radius-md);
	transition: 100ms;

	&:hover {
		background: var(--gray-100);
	}

	:global(.dark) &:hover {
		background: var(--neutral-800);
	}
}
</style>

<template>
	<p :class="$style.message"><slot /></p>
</template>

<style module lang="scss">
.message {
	text-align: center;
	font-size: var(--font-size-4xl);
}
</style>

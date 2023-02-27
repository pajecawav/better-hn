<template>
	<div :class="$style.container">
		<Header />
		<slot />
	</div>
</template>

<style module>
.container {
	max-width: var(--size-screen-md);
	margin: 0 auto;
}
</style>

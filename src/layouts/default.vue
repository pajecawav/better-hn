<template>
	<div :class="$style.container">
		<Header />
		<slot />
	</div>
</template>

<style module>
.container {
	max-width: 40rem;
	margin: 0 auto;
}
</style>

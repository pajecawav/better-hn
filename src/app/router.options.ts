import type { RouterConfig } from "@nuxt/schema";

// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
	scrollBehavior(to, from, savedPosition) {
		if (to.name === "topic" && from.name === "topic") {
			return { left: 0, top: 0 };
		}
		return savedPosition;
	},
};

import { createConfigForNuxt } from "@nuxt/eslint-config/flat";

export default createConfigForNuxt().override("nuxt/vue/rules", {
	rules: {
		"vue/multi-word-component-names": "off",
		// TODO: is it okay to turn this off?
		"vue/no-multiple-template-root": "off",
	},
});

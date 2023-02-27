module.exports = {
	root: true,
	extends: ["@nuxt/eslint-config", "prettier"],
	rules: {
		"vue/multi-word-component-names": "off",
		// TODO: is it okay to turn this off?
		"vue/no-multiple-template-root": "off",
	},
};

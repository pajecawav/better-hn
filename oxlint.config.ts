import { defineOxlintConfig } from "@pajecawav/tools";

export default defineOxlintConfig({
	ignorePatterns: ["**/.output"],
	rules: {
		"typescript/no-unsafe-type-assertion": "off",
	},
});

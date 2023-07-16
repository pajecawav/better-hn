/** @type {import("prettier").Config} */
module.exports = {
	printWidth: 100,
	useTabs: true,
	tabWidth: 4,
	arrowParens: "avoid",
	overrides: [
		{
			files: "*.md",
			options: {
				useTabs: false,
			},
		},
	],
};

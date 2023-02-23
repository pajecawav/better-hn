export default {
	"*.{vue,js,ts,cjs,cts,json,md,yml,css}": filenames =>
		`prettier --write ${filenames.map(filename => `'${filename}'`).join(" ")}`,
	"src/**/*.{vue,js,jsx,ts,tsx}": () => "pnpm lint:tsc",
	"src/**/*.{vue,js,jsx,ts,tsx}": "eslint",
};

export default defineNitroConfig({
	srcDir: "src",
	errorHandler: "~/error",
	compatibilityDate: "2024-12-30",
	preset: process.env.VERCEL ? "vercel-edge" : undefined,
	compressPublicAssets: {
		gzip: true,
		brotli: true,
	},
	publicAssets: [
		{
			baseURL: "assets",
			dir: "../dist-vite/assets",
			maxAge: 365 * 24 * 60 * 60,
		},
		{
			dir: "../dist-vite",
		},
	],
	serverAssets: [
		{
			baseName: "vite",
			dir: "../dist-vite/.vite",
		},
	],
	routeRules: {
		"/": { redirect: "/top" },
		"/post/*": { cache: { maxAge: 10 } },
	},
	typescript: {
		tsConfig: {
			compilerOptions: {
				skipLibCheck: true,
				jsx: "react-jsx",
				// dumb workaround because nitro's default tsconfig for some reason contains
				// jsxFactory/jsxFragmentFactory for nano-jsx
				jsxFactory: "",
				jsxFragmentFactory: "",
				jsxImportSource: "hono/jsx",
			},
		},
	},
	esbuild: {
		options: {
			jsx: "automatic",
			jsxImportSource: "hono/jsx",
		},
	},
});

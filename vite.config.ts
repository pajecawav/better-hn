import yamf from "@pajecawav/yamf/vite";
import { rolldown } from "rolldown";
import { defineConfig, type PluginOption } from "vite";

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	build: {
		sourcemap: true,
	},
	plugins: [
		yamf({
			nitro: {
				errorHandler: "./src/error.ts",
				compatibilityDate: "2026-04-29",
				preset: process.env.VERCEL ? "vercel" : undefined,
				routeRules: {
					// Permanent (not the default 307) so search engines consolidate
					// link equity on /top instead of treating the move as temporary.
					"/": { redirect: { to: "/top", status: 308 } },
					// "/*": { cache: { maxAge: 60 } },
					// "/post/*": { cache: { maxAge: 60 } },
					// "/user/*": { cache: { maxAge: 60 } },
				},
			},
		}),
		bundledStringPlugin(),
	],
});

function bundledStringPlugin(): PluginOption {
	return {
		name: "bundled-string",
		load: {
			filter: {
				id: /\?bundle$/,
			},
			async handler(id: string) {
				const entry = id.replace(/\?bundle$/, "");

				const bundle = await rolldown({
					input: entry,
				});

				const output = await bundle.generate({
					format: "iife",
					minify: true,
				});

				const chunk = output.output.find(o => o.type === "chunk");

				if (!chunk) {
					throw new Error("No chunk found");
				}

				return `export default ${JSON.stringify(chunk.code)}`;
			},
		},
	};
}

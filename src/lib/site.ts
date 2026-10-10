// Single source of the public origin for canonical URLs, og:url, JSON-LD,
// RSS and the sitemap. On Vercel every deployment — previews included —
// carries VERCEL_PROJECT_PRODUCTION_URL pointing at the production domain,
// so previews canonicalize to prod; the constant is the local-dev fallback.
//
// Deliberately import-free so plain node scripts (scripts/build-sitemap.ts)
// can use it without path aliases or bundler magic.
const FALLBACK_SITE_URL = "https://bhn.pajecawav.dev";

export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
	: FALLBACK_SITE_URL;

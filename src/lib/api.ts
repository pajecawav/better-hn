// Base URL of the better-hn-api instance this app reads from. Override with
// BHN_API_URL to point at a local or staging deployment; the constant is the
// production fallback. Trailing slashes in the override are tolerated.
const DEFAULT_API_URL = "https://api.bhn.pajecawav.dev";

/** Build an absolute better-hn-api URL for a path like `/item/8863`. */
export const bhnApiUrl = (path: string) =>
	`${(process.env.BHN_API_URL ?? DEFAULT_API_URL).replace(/\/+$/, "")}${path}`;

import { createContext, useContext } from "hono/jsx";
import type { Theme } from "./theme";

export interface SSRContextValue {
	url: URL;
	title?: string;
	theme: Theme;
}

export const SSRContext = createContext<SSRContextValue | null>(null);

export const useSSRContext = () => {
	const ctx = useContext(SSRContext);

	if (!ctx) {
		throw new Error("SSRContext is null");
	}

	return ctx;
};

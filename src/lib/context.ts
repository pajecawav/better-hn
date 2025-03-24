import { createContext, useContext } from "hono/jsx";
import { Theme } from "./theme";
import { Assets } from "~/assets";

export interface SSRContextValue {
	url: URL;
	title: string;
	assets: Assets;
	theme?: Theme;
}

export const SSRContext = createContext<SSRContextValue | null>(null);

export const useSSRContext = () => {
	const ctx = useContext(SSRContext);

	if (!ctx) {
		throw new Error("SSRContext is null");
	}

	return ctx;
};

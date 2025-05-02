import { createContext, useContext } from "hono/jsx";
import { ServerTiming } from "tiny-server-timing";
import { Assets } from "~/assets";
import { Theme } from "./theme";

export interface SSRContextValue {
	url: URL;
	title: string;
	assets: Assets;
	theme?: Theme;
	timing: ServerTiming;
}

export const SSRContext = createContext<SSRContextValue | null>(null);

export const useSSRContext = () => {
	const ctx = useContext(SSRContext);

	if (!ctx) {
		throw new Error("SSRContext is null");
	}

	return ctx;
};

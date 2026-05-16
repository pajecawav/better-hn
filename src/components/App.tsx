import type { PropsWithChildren } from "hono/jsx";
import { InlineScript } from "./InlineScript";
import { Layout } from "./Layout";

export const App = ({ children }: PropsWithChildren) => {
	return (
		<>
			<InlineScript />
			<Layout>{children}</Layout>
		</>
	);
};

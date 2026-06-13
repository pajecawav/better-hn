import type { PropsWithChildren } from "hono/jsx";
import { InlineScript } from "../components/InlineScript";
import { Layout } from "../components/Layout";
import "./styles/index.css";

export default function Root({ children }: PropsWithChildren) {
	return (
		<>
			<InlineScript />
			<Layout>{children}</Layout>
		</>
	);
}

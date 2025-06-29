import { PropsWithChildren } from "hono/jsx";
import { useSSRContext } from "~/lib/context";
import { InlineScript } from "./InlineScript";
import { Layout } from "./Layout";
import { Meta } from "./Meta";

export const App = ({ children }: PropsWithChildren) => {
	const { theme } = useSSRContext();

	return (
		<html lang="en" class={theme === "dark" ? "dark" : undefined}>
			<Meta />

			<body>
				<InlineScript />

				<Layout>{children}</Layout>
			</body>
		</html>
	);
};

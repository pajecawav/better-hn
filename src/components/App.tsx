import { FC, PropsWithChildren } from "hono/jsx";
import { useSSRContext } from "~/lib/context";
import { Layout } from "./Layout";
import { Meta } from "./Meta";

export const App: FC = ({ children }: PropsWithChildren) => {
	const { theme } = useSSRContext();

	return (
		<html lang="en" class={theme === "dark" ? "dark" : undefined}>
			<Meta />

			<body>
				<script
					dangerouslySetInnerHTML={{
						__html: `
                            if (!("share" in navigator)) {
                                document.body.classList.add("noshare");
                            }
                    `,
					}}
				/>

				<Layout>{children}</Layout>
			</body>
		</html>
	);
};

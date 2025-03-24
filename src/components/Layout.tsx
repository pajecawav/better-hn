import { PropsWithChildren } from "hono/jsx";
import { Header } from "~/components/Header";

export const Layout = ({ children }: PropsWithChildren) => {
	return (
		<div className="container">
			<Header />
			<main>{children}</main>
		</div>
	);
};

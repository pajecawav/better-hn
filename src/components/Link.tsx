import { JSX } from "hono/jsx";
import { cn } from "~/lib/utils";

type LinkProps = JSX.IntrinsicElements["a"] & {
	activeClassName?: string;
	isActive?: boolean;
};

export const Link = ({ className, activeClassName, isActive, ...props }: LinkProps) => {
	return <a class={cn(className, isActive && activeClassName)} {...props} />;
};

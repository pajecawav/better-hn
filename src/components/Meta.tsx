import { useSSRContext } from "~/lib/context";
import { getThemeColor } from "~/lib/theme";
import { buildPageTitle } from "~/lib/title";

export const Meta = () => {
	const { title, theme, assets } = useSSRContext();

	return (
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta name="application-name" content="Better HN" />
			<meta name="description" content="A Hacker News clone built with Nitro and Hono" />
			<meta name="theme-color" content={getThemeColor(theme)} />
			<link rel="icon" href="/favicon.ico" sizes="any" />
			<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
			<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
			<link rel="manifest" href="/manifest.webmanifest" />

			<title>{buildPageTitle(title)}</title>

			{assets.css.map(href => (
				<link rel="stylesheet" href={href} />
			))}

			{assets.scripts.map(href => (
				<script type="module" src={href} />
			))}
		</head>
	);
};

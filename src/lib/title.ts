const DEFAULT_TITLE = "Better HN";

export const buildPageTitle = (title?: string) =>
	title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;

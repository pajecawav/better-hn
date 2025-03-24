const HN_POST_LINK_REGEXP = /https?:&#x2F;&#x2F;news.ycombinator.com&#x2F;item\?id=(\d+)/g;

export const replaceHnPostLinks = (text: string) => {
	return text.replaceAll(HN_POST_LINK_REGEXP, "/post/$1");
};

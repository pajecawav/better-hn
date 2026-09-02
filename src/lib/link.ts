const HN_POST_LINK_REGEXP =
	/https?:&#x2F;&#x2F;news.ycombinator.com&#x2F;item\?id=(\d+)(#([\w-]+))?/g;

export const replaceHnPostLinks = (text: string) => {
	return text.replaceAll(HN_POST_LINK_REGEXP, (_, id: string, _hash: string, anchor?: string) =>
		anchor ? `/post/${id}#comment-${anchor}` : `/post/${id}`,
	);
};

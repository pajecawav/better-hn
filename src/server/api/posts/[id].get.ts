import { Post } from "~~/src/lib/post";

export default defineEventHandler(async event => {
	const id = event.context.params?.id as string;
	setHeader(event, "cache-control", "public, max-age=60");
	const post = await $fetch<Post>(`https://api.hnpwa.com/v0/item/${id}.json`);
	return post;
});

import { Item } from "~~/src/lib/item";

export default defineEventHandler(async event => {
	const id = event.context.params?.id as string;
	setHeader(event, "cache-control", "public, max-age=60");
	const item = await $fetch<Item>(`https://api.hnpwa.com/v0/item/${id}.json`);
	return item;
});

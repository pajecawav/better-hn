import type { User } from "~~/src/lib/user";

export default defineEventHandler(async event => {
	const name = event.context.params?.name as string;

	setHeader(event, "cache-control", "public, max-age=60");

	const user = await $fetch<User>(`https://api.hnpwa.com/v0/user/${name}.json`);
	return user;
});

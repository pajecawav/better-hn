import { defineErrorHandler } from "nitro";

export default defineErrorHandler(error => {
	console.error("Unexpected error: ", error);
	return new Response(`${error.status} ${error.message}`);
});

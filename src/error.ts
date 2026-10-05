import { defineErrorHandler } from "nitro";

const escapeHtml = (text: string) =>
	text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export default defineErrorHandler(error => {
	console.error("Unexpected error: ", error);

	// The status must be passed explicitly — a bare Response defaults to 200,
	// which turns every error page into a soft-404 for crawlers.
	const status = error.status ?? 500;
	const message = error.message || "Something went wrong";

	const html = `<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="robots" content="noindex">
	<title>${status} | Better HN</title>
	<style>
		body {
			margin: 0;
			min-height: 100dvh;
			display: grid;
			place-content: center;
			gap: 8px;
			font-family: system-ui, sans-serif;
			background: #18181b;
			color: #fff;
			text-align: center;
		}
		h1 { margin: 0; font-size: 64px; }
		p { margin: 0; color: #a1a1aa; }
		a { color: #fff; }
	</style>
</head>
<body>
	<h1>${status}</h1>
	<p>${escapeHtml(message)}</p>
	<a href="/top">Back to the front page</a>
</body>
</html>`;

	return new Response(html, {
		status,
		headers: { "content-type": "text/html; charset=utf-8" },
	});
});

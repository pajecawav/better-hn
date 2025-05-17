import { ServerTiming } from "tiny-server-timing";
import { sendEarlyHints } from "~/assets";
import { Link } from "~/components/Link";
import { User } from "~/lib/user";
import { renderPage } from "~/render";

export default eventHandler(async event => {
	const userName = getRouterParam(event, "userName");

	await sendEarlyHints(event);

	const timing = new ServerTiming();

	const user = await timing.timeAsync("fetch", () =>
		$fetch<User>(`https://api.hnpwa.com/v0/user/${userName}.json`),
	);

	if (!user) {
		throw createError({ statusCode: 404, message: "User not found" });
	}

	return renderPage(
		<div class="user">
			<h1 class="name">{user.id}</h1>
			<div class="info">
				<span>Created:</span>
				<span>{user?.created}</span>
				<span>Karma:</span>
				<span>{user?.karma}</span>
			</div>

			<p class="links">
				<Link href={`https://news.ycombinator.com/submitted?id=${user.id}`}>
					submissions
				</Link>
				{" / "}
				<Link href={`https://news.ycombinator.com/threads?id=${user.id}`}>comments</Link>
				{" / "}
				<Link href={`https://news.ycombinator.com/favorites?id=${user.id}`}>favorites</Link>
			</p>

			{user.about && <div class="about" dangerouslySetInnerHTML={{ __html: user.about }} />}
		</div>,
		{ title: userName, event, timing },
	);
});

import { definePage } from "@pajecawav/yamf";
import { HTTPError } from "nitro";
import { withServerTiming } from "nitro/h3";
import { $fetch } from "ofetch";
import { Link } from "~/components/Link";
import { buildPageTitle } from "~/lib/title";
import type { User } from "~/lib/user";

export default definePage({
	render: async (event, { head }) => {
		const { userName } = event.context.params ?? {};

		event.res.headers.set("cache-control", "public, max-age=60, stale-while-revalidate=10");

		const user = await withServerTiming(event, "fetch", () =>
			$fetch<User>(`https://api.hnpwa.com/v0/user/${userName}.json`),
		);

		if (!user) {
			throw new HTTPError({ statusCode: 404, message: "User not found" });
		}

		head.push({
			title: buildPageTitle(userName),
		});

		return (
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
					<Link href={`https://news.ycombinator.com/threads?id=${user.id}`}>
						comments
					</Link>
					{" / "}
					<Link href={`https://news.ycombinator.com/favorites?id=${user.id}`}>
						favorites
					</Link>
				</p>

				{user.about && (
					<div class="about" dangerouslySetInnerHTML={{ __html: user.about }} />
				)}
			</div>
		);
	},
});

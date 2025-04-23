const MOUSE_TIMEOUT_MS = 100;

const prefetch = (el: HTMLAnchorElement) => {
	const href = el.getAttribute("href");

	if (href?.[0] !== "/" || !el.dataset.prefetch) {
		return;
	}

	const link = document.createElement("link");
	link.href = href;
	link.rel = "prefetch";
	link.as = "document";
	document.head.appendChild(link);

	delete el.dataset.prefetch;
};

document.querySelectorAll<HTMLAnchorElement>("[data-prefetch]").forEach(el => {
	let timeoutId: number | undefined = undefined;

	const onMouseEnter = (event: MouseEvent) => {
		if (event.relatedTarget) {
			timeoutId = window.setTimeout(handle, MOUSE_TIMEOUT_MS);
		}
	};

	const onMouseLeave = () => {
		window.clearTimeout(timeoutId);
	};

	const handle = () => {
		prefetch(el);

		window.clearTimeout(timeoutId);

		el.removeEventListener("mouseenter", onMouseEnter);
		el.removeEventListener("mouseleave", onMouseLeave);
		el.removeEventListener("touchstart", handle);
	};

	el.addEventListener("mouseenter", onMouseEnter);
	el.addEventListener("mouseleave", onMouseLeave);
	el.addEventListener("touchstart", handle, { passive: true });
});

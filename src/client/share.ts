(window as any).Share = {
	sharePage() {
		navigator.share({ url: window.location.href });
	},
};

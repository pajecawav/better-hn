(window as any).Share = {
	sharePage() {
		void navigator.share({ url: window.location.href });
	},
};

const getComment = (commentId: number) => {
	return document.getElementById(`comment-${commentId}`);
};

(window as any).Comments = {
	toggleComment(commentId: number) {
		const comment = getComment(commentId);

		if (!comment) {
			return;
		}

		const isFolded = comment.dataset.folded === "true";
		comment.dataset.folded = String(!isFolded);

		comment.querySelector(".info")?.scrollIntoView({ block: "nearest" });
	},
};

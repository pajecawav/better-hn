export const cn = (...values: unknown[]): string => {
	return values.filter(value => typeof value === "string" && value).join(" ");
};

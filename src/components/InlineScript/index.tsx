import script from "./script?bundle";

export const InlineScript = () => {
	return <script dangerouslySetInnerHTML={{ __html: script }} />;
};

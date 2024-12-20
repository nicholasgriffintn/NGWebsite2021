import { JSON_HEADERS } from "./constants";
import { BlogMetadata } from './types';

export const createResponse = (data: any, status = 200): Response => {
    return new Response(
        JSON.stringify(data),
        { 
            status,
            headers: JSON_HEADERS
        }
    );
};

export function parseFrontmatter(fileContent: string): { metadata: BlogMetadata; content: string } {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);
	if (!match) {
		throw new Error("No frontmatter block found");
	}

	const frontMatterBlock = match[1];
	const content = fileContent.replace(frontmatterRegex, "").trim();

	const metadata = frontMatterBlock?.split("\n").reduce<Record<string, string | string[]>>(
		(acc, line) => {
			const [key, ...valueArr] = line.split(": ");
			if (key) {
				let value: string[] | string = valueArr.join(": ").trim();
				value = value.replace(/^['"](.*)['"]$/, "$1");

				if (value.startsWith("[") && value.endsWith("]")) {
					value = value
						.slice(1, -1)
						.split(",")
						.map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''));
				}

				acc[key.trim()] = value;
			}
			return acc;
		},
		{},
	) as unknown as BlogMetadata;

	const requiredFields = ['title', 'date'] as const;
	requiredFields.forEach((field: keyof BlogMetadata) => {
		if (!metadata || !metadata[field]) {
			throw new Error(`Missing required metadata field: ${field}`);
		}
	});

	return {
		metadata: metadata,
		content
	};
}
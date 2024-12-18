import type { Metadata } from "@/types/blog";
import { CacheManager } from "./cache";

const BASE_API_URL = "https://content.s3rve.co.uk";

const cacheManager = new CacheManager<any>();

async function getApiData(path: string, options: { retry?: number } = {}) {
	const cacheKey = `api_${path}`;
	const cached = cacheManager.get<Response>(cacheKey);
	if (cached) return cached;

	const url = `${BASE_API_URL}/${path}`;
	const maxRetries = options.retry ?? 3;
	let lastError: Error | null = null;

	for (let attempt = 0; attempt < maxRetries; attempt++) {
		try {
			const response = await fetch(url);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const clonedResponse = response.clone();
			cacheManager.set(cacheKey, clonedResponse);
			return clonedResponse;
		} catch (error) {
			lastError = error instanceof Error ? error : new Error(String(error));
			await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
		}
	}

	throw lastError ?? new Error(`Failed to fetch data from ${url}`);
}

export function parseFrontmatter(fileContent: string) {
	const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
	const match = frontmatterRegex.exec(fileContent);
	if (!match) {
		throw new Error("No frontmatter block found");
	}

	const frontMatterBlock = match[1];
	const content = fileContent.replace(frontmatterRegex, "").trim();

	const metadata = frontMatterBlock?.split("\n").reduce(
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
		{} as Partial<Metadata>,
	);

	const requiredFields: (keyof Metadata)[] = ['title', 'date'];
	requiredFields.forEach(field => {
		if (!metadata || !metadata[field]) {
			console.warn(`Missing required metadata field: ${field}`);
		}
	});

	return {
		metadata: metadata as Metadata,
		content
	};
}

async function getList({ path }: { path: string }): Promise<{ slug: string }[]> {
	const response = await getApiData(path);
	const data = await response.json() as { objects: { key: string }[] };

	const objects = data.objects;

	return objects.map((object) => {
		return {
			slug: object.key,
		};
	});
}

async function getPostData({ path }: { path: string }): Promise<string> {
	const data = await getApiData(path);

	return data.text();
}

async function getMDXData({ path }: { path: string }) {
	const cacheKey = `mdx_${path}`;
	const cached = cacheManager.get<Awaited<ReturnType<typeof getMDXData>>>(cacheKey);
	if (cached) return cached;

	const mdxFiles = await getList({ path });

	const posts = await Promise.all(mdxFiles.map(async (file) => {
		const data = await getPostData({ path: file.slug });
		const { metadata, content } = parseFrontmatter(data);

		const paths = file.slug.split("/");
		const slug = paths[paths.length - 1]?.replace(".md", "");

		return {
			metadata,
			slug,
			content,
			path: paths,
		};
	}));

	cacheManager.set(cacheKey, posts);
	return posts;
}

export async function getBlogPosts(showArchived = false) {
	const cacheKey = `posts_${showArchived}`;
	const cached = cacheManager.get<Awaited<ReturnType<typeof getBlogPosts>>>(cacheKey);
	if (cached) {
		return cached
	};

	try {
		const environment = process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'production';
		const data = await getMDXData({ path: "content" });

		const posts = data.filter(
			(post) => {
				if (environment !== "development") {
					return !post.metadata.draft && (!post.metadata.archived || showArchived);
				}
				return !post.metadata.archived || showArchived;
			},
		).sort(
			(a, b) =>
				new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime(),
		);

		cacheManager.set(cacheKey, posts);
		return posts;
	} catch (error) {
		console.error('Failed to get blog posts:', error);
		return [];
	}
}

export async function getPaginatedBlogPosts({
	showArchived = false,
	page = 1,
	limit = 10,
}) {
	const posts = await getBlogPosts(showArchived);
	const startIndex = (page - 1) * limit;
	const endIndex = startIndex + limit;
	const paginatedPosts = posts.slice(startIndex, endIndex);

	return paginatedPosts;
}

export async function getAllTags() {
	const posts = await getBlogPosts();
	const tagCounts = posts.reduce(
		(acc, post) => {
			if (Array.isArray(post.metadata.tags)) {
				post.metadata.tags.forEach((tag) => {
					if (acc[tag]) {
						acc[tag]++;
					} else {
						acc[tag] = 1;
					}
				});
			}
			return acc;
		},
		{} as Record<string, number>,
	);

	return tagCounts;
}

export async function getBlogPostsByTag(tag: string) {
	const posts = await getBlogPosts();
	return posts.filter((post) => post.metadata.tags?.includes(tag));
}

export async function getBlogPostBySlug(slug: string) {
	const posts = await getBlogPosts(true);
	const post = posts.find((post) => post.slug === slug);
	return post;
}

export function formatDate(date: string, includeRelative = false) {
	const currentDate = new Date();
	const targetDate = new Date(date.includes("T") ? date : `${date}T00:00:00`);
	const diffTime = currentDate.getTime() - targetDate.getTime();
	const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
	const diffMonths =
		currentDate.getMonth() -
		targetDate.getMonth() +
		12 * (currentDate.getFullYear() - targetDate.getFullYear());
	const diffYears = currentDate.getFullYear() - targetDate.getFullYear();

	let formattedDate = "";
	if (diffYears > 0) {
		formattedDate = `${diffYears}y ago`;
	} else if (diffMonths > 0) {
		formattedDate = `${diffMonths}mo ago`;
	} else if (diffDays > 0) {
		formattedDate = `${diffDays}d ago`;
	} else {
		formattedDate = "Today";
	}

	const fullDate = targetDate.toLocaleString("en-gb", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return includeRelative ? `${fullDate} (${formattedDate})` : fullDate;
}

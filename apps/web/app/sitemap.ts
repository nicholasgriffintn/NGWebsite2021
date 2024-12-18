import { getBlogPosts } from "@/lib/blog";

export const baseUrl = "https://nicholasgriffin.dev";

export default async function sitemap() {
	const routes = ["", "/blog"].map((route) => ({
		url: `${baseUrl}${route}`,
		lastModified: new Date().toISOString().split("T")[0],
	}));

	const posts = await getBlogPosts();

	if (!posts) {
		return [...routes];
	}

	const blogs = posts.map((post) => ({
		url: `${baseUrl}/blog/${post.slug}`,
		lastModified: post.metadata.updated || post.metadata.date,
	}));

	return [...routes, ...blogs];
}

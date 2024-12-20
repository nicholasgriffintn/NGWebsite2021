import { notFound } from "next/navigation";

import { PageLayout } from "@/components/PageLayout";
import { InnerPage } from "@/components/InnerPage";
import { formatDate, getBlogPosts, getBlogPostBySlug } from "@/lib/blog";
import { CustomMDX } from "@/components/MDX";
import { parseMarkdown } from "@/lib/markdown";
import { Image } from "@/components/Image";
import { AlertMessage } from "@/components/Alert";
import { Link } from "@/components/Link";

export const dynamicParams = false;

export async function generateStaticParams() {
	const posts = await getBlogPosts(true);

	return posts.map((post) => ({
		slug: post.slug,
	}));
}

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		return;
	}

	const { title, date: publishedTime, description, image } = post.metadata;
	const ogImage = image
		? image
		: `https://nicholasgriffin.dev/og?title=${encodeURIComponent(title)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			type: "article",
			publishedTime,
			url: `https://nicholasgriffin.dev/blog/${post.slug}`,
			images: [
				{
					url: ogImage,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImage],
		},
	};
}

export default async function Home({ params }) {
	const { slug } = await params;
	const post = await getBlogPostBySlug(slug);

	if (!post) {
		notFound();
	}

	return (
		<PageLayout>
			<InnerPage>
				<script
					type="application/ld+json"
					suppressHydrationWarning
					// biome-ignore lint/security/noDangerouslySetInnerHtml: It's on purpose
					dangerouslySetInnerHTML={{
						__html: JSON.stringify({
							"@context": "https://schema.org",
							"@type": "BlogPosting",
							headline: post.title,
							datePublished: post.created_at,
							dateModified: post.updated_at,
							description: post.description,
							image: post.image_url
								? `https://nicholasgriffin.dev/${post.image_url}`
								: `/og?title=${encodeURIComponent(post.title)}`,
							url: `https://nicholasgriffin.dev/blog/${post.slug}`,
							author: {
								"@type": "Person",
								name: "Nicholas Griffin",
							},
						}),
					}}
				/>
				<h1 className="text-2xl md:text-4xl font-bold text-primary-foreground">
					{post.title}
				</h1>
				<div className="grid grid-cols-5 gap-4">
					<div className="col-span-5 md:col-span-3 lg:col-span-4 pt-5">
						<div className="text-primary-foreground lg:max-w-[75%]">
							<div className="mb-2">
								{Array.isArray(post.tags) && post.tags.length > 0 && (
									<div className="text-sm text-muted-foreground flex flex-wrap items-center space-x-2 mb-2">
										<span className="text-sm text-muted-foreground">Tags:</span>
										{post.tags.map((tag) => (
											<Link key={tag} href={`/tags/${tag}`} muted>
												#{tag}
											</Link>
										))}
									</div>
								)}
								{post.created_at && (
									<span className="text-sm text-muted-foreground">
										Published on {formatDate(post.created_at)}
									</span>
								)}
								{post.updated_at && (
									<>
										<span className="text-sm text-muted-foreground"> • </span>
										<span className="text-sm text-muted-foreground">
											Updated on {formatDate(post.updated_at)}
										</span>
									</>
								)}
							</div>
						</div>
					</div>
					{post.image_url && !post.metadata.hideFeaturedImage && (
						<div className="col-span-5 md:col-span-2 lg:col-span-1">
							<Image
								src={post.image_url}
								alt={post.image_alt || post.title}
								className="w-full h-full object-cover rounded-lg"
							/>
						</div>
					)}
				</div>
				<article className="prose dark:prose-invert pt-2 w-full min-w-full lg:min-w-[75%]">
					{post.draft && (
						<AlertMessage
							variant="warning"
							title="This post is a draft!"
							description="This post is a draft and may not be finished."
						/>
					)}
					{post.archived && (
						<AlertMessage
							variant="warning"
							title="This post has been archived!"
							description="This post has been archived due to it being from a previous version of my site, or a bit too old. Some things might be broken and it may not be up to date."
						/>
					)}
					<div>{parseMarkdown(post.description || "")}</div>
					<CustomMDX source={post.content} />
					{post.metadata.link && (
						<Link href={post.metadata.link} className="text-primary-foreground">
							You can find the original post here.
						</Link>
					)}
				</article>
			</InnerPage>
		</PageLayout>
	);
}

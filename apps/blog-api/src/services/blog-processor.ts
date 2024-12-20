import { BlogMetadata, ProcessedBlogData } from "../types";

export class BlogProcessor {
    constructor(private readonly db: D1Database) {}

    private extractSlugFromKey(key: string): string {
        const paths = key.split("/");
        return paths[paths.length - 1]?.replace(".md", "") || "";
    }

    processMetadata(metadata: BlogMetadata, key: string): ProcessedBlogData {
        const slug = this.extractSlugFromKey(key);
        const now = new Date().toISOString();

        return {
            id: slug,
            title: metadata.title,
            description: metadata.description || null,
            tags: JSON.stringify(metadata.tags || []),
            image_url: metadata.image || null,
            image_alt: metadata.imageAlt || null,
            slug,
            storage_key: key,
            draft: metadata.draft || false,
            archived: metadata.archived || false,
            created_at: metadata.date || now,
            updated_at: metadata.updated || null,
            content: "", // Will be set later
            type: "blog",
            metadata: JSON.stringify({
                hideFeaturedImage: metadata.hideFeaturedImage,
                isBookmark: metadata.isBookmark,
                link: metadata.link
            })
        };
    }

    async saveBlogPost(data: ProcessedBlogData): Promise<void> {
        const stmt = this.db.prepare(`
            REPLACE INTO document (
                id, title, description, tags, image_url, image_alt,
                slug, storage_key, draft, archived, created_at,
                updated_at, content, type, metadata
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `).bind(
            data.id,
            data.title,
            data.description,
            data.tags,
            data.image_url,
            data.image_alt,
            data.slug,
            data.storage_key,
            data.draft,
            data.archived,
            data.created_at,
            data.updated_at,
            data.content,
            data.type,
            data.metadata
        );

        try {
            await stmt.run();
        } catch (error) {
            console.error(`Error saving blog post ${data.slug}:`, error);
            throw new Error(`Failed to save blog post: ${data.slug}`);
        }
    }
}
import { createResponse, parseFrontmatter } from "./utils";
import { CORS_HEADERS } from "./constants";
import { BlogService } from "./services/blog";
import { QueryParams, QueueMessage } from "./types";
import { BlogProcessor } from "./services/blog-processor";
import { StorageService } from "./services/storage";

const handler: ExportedHandler<{ DB: D1Database, BUCKET: R2Bucket }, QueueMessage> = {
    async fetch(request: Request, env: { DB: D1Database, BUCKET: R2Bucket }): Promise<Response> {
        if (request.method === "OPTIONS") {
            return new Response(null, { headers: CORS_HEADERS });
        }

        if (request.method !== "GET") {
            return createResponse({ error: "Method not allowed" }, 405);
        }

        try {
            const url = new URL(request.url);
            const paths = url.pathname.slice(1).split("/");

            if (paths[0] !== "content") {
                return createResponse({ error: "Not found" }, 404);
            }

            const blogService = new BlogService(env.DB);

            if (paths.length === 1) {
                const params: QueryParams = {
                    drafts: url.searchParams.get('drafts') === 'true',
                    archived: url.searchParams.get('archived') === 'true'
                };
                
                const posts = await blogService.getAllPosts(params);
                return createResponse(posts);
            }

            if (paths.length === 2) {
                const post = await blogService.getPostBySlug(paths[1]);
                if (!post) {
                    return createResponse({ error: "Post not found" }, 404);
                }
                return createResponse(post);
            }

            return createResponse({ error: "Invalid path" }, 404);
        } catch (error) {
            console.error('Error processing request:', error);
            return createResponse({ 
                error: "Internal server error",
                message: error instanceof Error ? error.message : 'Unknown error'
            }, 500);
        }
    },
    async queue(batch: MessageBatch<QueueMessage>, env: { BUCKET: R2Bucket, DB: D1Database }): Promise<void> {
        if (batch.messages.length === 0) {
            return;
        }

        console.log(`Processing ${batch.messages.length} messages`);
        
        const storageService = new StorageService(env.BUCKET);
        const blogProcessor = new BlogProcessor(env.DB);

        const results = await Promise.allSettled(
            batch.messages.map(async message => {
                console.log(`Processing ${message.body.key}`);

                const content = await storageService.getObject(message.body.key);
                if (!content) {
                    console.log(`Object ${message.body.key} not found`);
                    return;
                }

                const { metadata, content: blogContent } = parseFrontmatter(content);
                const processedData = blogProcessor.processMetadata(metadata, message.body.key);
                processedData.content = blogContent;

                await blogProcessor.saveBlogPost(processedData);
                console.log(`Processed ${message.body.key}`);
            })
        );
        
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.error(
                    `Failed to process message ${batch.messages[index].body.key}:`,
                    result.reason
                );
            }
        });

        console.log(`Completed processing ${batch.messages.length} messages`);
    }
}

export default handler;

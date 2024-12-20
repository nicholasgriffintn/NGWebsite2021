import { createResponse } from "./utils";
import { CORS_HEADERS } from "./constants";
import { BlogService } from "./services/blog";
import { QueryParams } from "./types";

const handler: ExportedHandler<{ DB: D1Database }> = {
    async fetch(request: Request, env: { DB: D1Database }): Promise<Response> {
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
    }
}

export default handler;
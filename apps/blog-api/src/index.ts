const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
}

const handler: ExportedHandler<{ BUCKET: R2Bucket; ENCRYPT_SECRET: string }> = {
    async fetch(request, env, event): Promise<Response> {
        try {
            if (request.method === "GET") {
                const url = new URL(request.url);
                const keys = url.pathname.slice(1).split("/");

                if (keys.length === 0) {
                    return new Response("Not found", { status: 404 });
                }

                if (keys[0] === "content") {
                    if (keys.length === 1) {
                        const list = await env.BUCKET.list({
                            prefix: "content/"
                        });

                        return new Response(JSON.stringify(list), { headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders
                        } });
                    }

                    const object = await env.BUCKET.get(keys.join("/"));
                    if (object) {
                        return new Response(object.body, { headers: {
                            "Content-Type": "application/json",
                            ...corsHeaders
                        } });
                    } else {
                        return new Response("Not found", { status: 404 });
                    }
                } else {
                    return new Response("Not found", { status: 404 });
                }
            } else {
                return new Response("Method not allowed", { status: 405 });
            }
        } catch (error) {
            console.error(error);
            return new Response("Internal server error", { status: 500 });
        }
    }
}

export default handler;
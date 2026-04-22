import { getAssetFromKV } from "@cloudflare/kv-asset-handler";
// @ts-ignore
import manifestJSON from "__STATIC_CONTENT_MANIFEST";

const assetManifest = JSON.parse(manifestJSON);

export default {
    async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
        const url = new URL(request.url);

        // API Route: POST /api/share
        if (request.method === "POST" && url.pathname === "/api/share") {
            try {
                // Check body size limit (500KB)
                const contentLength = parseInt(request.headers.get("content-length") || "0");
                if (contentLength > 500 * 1024) {
                    return new Response(JSON.stringify({ error: "Content exceeds 500KB limit" }), {
                        status: 413,
                        headers: { "Content-Type": "application/json" }
                    });
                }

                const body = await request.json() as { content?: string };
                if (!body.content) {
                    return new Response(JSON.stringify({ error: "Content is required" }), {
                        status: 400,
                        headers: { "Content-Type": "application/json" }
                    });
                }

                if (new Blob([body.content]).size > 500 * 1024) {
                    return new Response(JSON.stringify({ error: "Content exceeds 500KB limit" }), {
                        status: 413,
                        headers: { "Content-Type": "application/json" }
                    });
                }

                // Generate 8-character random ID
                const id = Math.random().toString(36).substring(2, 10);
                
                // Store in KV with 30-day TTL (2592000 seconds)
                await env.SHARED_CONTENT.put(id, body.content, { expirationTtl: 2592000 });

                return new Response(JSON.stringify({ id }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: "Invalid request" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        // API Route: GET /api/share/:id
        if (request.method === "GET" && url.pathname.startsWith("/api/share/")) {
            const id = url.pathname.split("/").pop();
            if (!id) {
                return new Response(JSON.stringify({ error: "Invalid ID" }), {
                    status: 400,
                    headers: { "Content-Type": "application/json" }
                });
            }

            try {
                const content = await env.SHARED_CONTENT.get(id);
                if (!content) {
                    return new Response(JSON.stringify({ error: "Content not found or expired" }), {
                        status: 404,
                        headers: { "Content-Type": "application/json" }
                    });
                }

                return new Response(JSON.stringify({ content }), {
                    status: 200,
                    headers: { "Content-Type": "application/json" }
                });
            } catch (e) {
                return new Response(JSON.stringify({ error: "Server error" }), {
                    status: 500,
                    headers: { "Content-Type": "application/json" }
                });
            }
        }

        try {
            return await getAssetFromKV(
                {
                    request,
                    waitUntil: ctx.waitUntil.bind(ctx),
                },
                {
                    ASSET_NAMESPACE: env.__STATIC_CONTENT,
                    ASSET_MANIFEST: assetManifest,
                }
            );
        } catch (e) {
            // If asset not found, serve index.html for SPA routing
            try {
                const notFoundResponse = await getAssetFromKV(
                    {
                        request: new Request(new URL("/index.html", request.url).toString(), request),
                        waitUntil: ctx.waitUntil.bind(ctx),
                    },
                    {
                        ASSET_NAMESPACE: env.__STATIC_CONTENT,
                        ASSET_MANIFEST: assetManifest,
                    }
                );
                return new Response(notFoundResponse.body, {
                    ...notFoundResponse,
                    status: 200,
                });
            } catch {
                return new Response("Not Found", { status: 404 });
            }
        }
    },
};

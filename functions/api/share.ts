export async function onRequestPost(context: any) {
    const { request, env } = context;
    try {
        const contentLength = parseInt(request.headers.get("content-length") || "0");
        if (contentLength > 500 * 1024) {
            return new Response(JSON.stringify({ error: "Content exceeds 500KB limit" }), {
                status: 413, headers: { "Content-Type": "application/json" }
            });
        }
        const body = await request.json() as { content?: string };
        if (!body.content) {
            return new Response(JSON.stringify({ error: "Content is required" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }
        if (new Blob([body.content]).size > 500 * 1024) {
            return new Response(JSON.stringify({ error: "Content exceeds 500KB limit" }), {
                status: 413, headers: { "Content-Type": "application/json" }
            });
        }
        const id = Math.random().toString(36).substring(2, 10);
        await env.SHARED_CONTENT.put(id, body.content, { expirationTtl: 2592000 });
        return new Response(JSON.stringify({ id }), {
            status: 200, headers: { "Content-Type": "application/json" }
        });
    } catch {
        return new Response(JSON.stringify({ error: "Invalid request" }), {
            status: 400, headers: { "Content-Type": "application/json" }
        });
    }
}

export async function onRequestPost(context: any) {
    const { request, env } = context;

    try {
        // Check body size limit (500KB)
        const contentLength = parseInt(request.headers.get("content-length") || "0");
        if (contentLength > 500 * 1024) {
            return new Response(JSON.stringify({ error: "Content exceeds 500KB limit" }), {
                status: 413,
                headers: { "Content-Type": "application/json" }
            });
        }

        const body = await request.json();
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

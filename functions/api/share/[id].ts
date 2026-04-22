export async function onRequestGet(context: any) {
    const { request, env, params } = context;
    const id = params.id;

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

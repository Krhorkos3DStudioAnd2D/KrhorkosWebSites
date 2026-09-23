export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/api/comments") {
      const { name, message } = await request.json();
      if (!name || !message) return new Response("Faltan datos", { status: 400 });
      
      await env.COMMENTS_DB.prepare(
        "INSERT INTO comments (name, message, approved) VALUES (?, ?, 1)"
      ).bind(name, message).run();
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" }
      });
    }

    if (request.method === "GET" && url.pathname === "/api/comments") {
      const { results } = await env.COMMENTS_DB.prepare(
        "SELECT * FROM comments WHERE approved = 1 ORDER BY created_at DESC"
      ).all();
      
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response("No encontrado", { status: 404 });
  }
};

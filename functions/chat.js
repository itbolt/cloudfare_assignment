// functions/chat.js
export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const userMsg = body.message || "";

    if (!userMsg) {
      return new Response("No message provided.", { status: 400 });
    }

    // Call Cloudflare Workers AI — Llama 3.1 8B Instruct
    const response = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          { role: "system", content: "You are a UCSB course helper. Be accurate and concise." },
          { role: "user", content: userMsg }
        ]
      }
    );

    const text = response?.response || "No response generated.";

    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "text/plain" }
    });

  } catch (err) {
    return new Response("Server error: " + err.toString(), { status: 500 });
  }
}

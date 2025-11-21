export async function onRequestPost({ request, env }) {
  try {
    const { message } = await request.json();

    const response = await env.AI.run("@cf/meta/llama-3-8b-instruct", {
      prompt: message
    });

    return new Response(JSON.stringify({ reply: response }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.toString() }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

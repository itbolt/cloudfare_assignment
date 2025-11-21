import { MemoryDO } from "./durable.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/chat") {
      const body = await request.json();
      const user_message = body.message || "";

      // Get durable object instance
      const id = env.MEMORY.idFromName("main");
      const stub = env.MEMORY.get(id);

      // Send user message to DO
      const response = await stub.fetch("https://do/memory", {
        method: "POST",
        body: JSON.stringify({ user_message })
      });

      return response;
    }

    return new Response("UCSB Course Helper Worker Running.");
  }
};

// ✅ REQUIRED BY CLOUDFLARE
export { MemoryDO } from "./durable.js";

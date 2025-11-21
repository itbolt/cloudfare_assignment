export class MemoryDO {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const { user_message } = await request.json();

    // Load stored memory
    const memory = await this.state.storage.get("memory") || "";

    // Compose prompt
    const full_prompt = `Memory: ${memory}\nUser: ${user_message}\nAssistant:`;

    // Call AI model
    const aiResponse = await this.env.AI.run({
      model: "@cf/meta/llama-3.3-70b-instruct",
      messages: [
        { role: "system", content: "You are UCSB Course Helper." },
        { role: "user", content: full_prompt }
      ]
    });

    const assistant_reply = aiResponse.response;

    // Summarize new memory
    const memSummary = await this.env.AI.run({
      model: "@cf/meta/llama-3.3-8b-instruct",
      messages: [
        { role: "system", content: "Summarize new info for memory." },
        {
          role: "user",
          content: `Prior memory: ${memory}\nNew user message: ${user_message}`
        }
      ]
    });

    const newMemory = memSummary.response;

    // Save memory
    await this.state.storage.put("memory", newMemory);

    return new Response(JSON.stringify({ reply: assistant_reply }), {
      headers: { "Content-Type": "application/json" }
    });
  }
}

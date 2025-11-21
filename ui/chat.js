document.getElementById("sendBtn").addEventListener("click", sendMessage);

async function sendMessage() {
    const input = document.getElementById("inputBox");
    const chatBox = document.getElementById("chatBox");

    const message = input.value.trim();
    if (!message) return;

    // Add user message to screen
    chatBox.textContent += `You: ${message}\n`;
    input.value = "";

    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });

        if (!res.ok) {
            chatBox.textContent += `⚠️ Server error: ${res.status}\n`;
            return;
        }

        const data = await res.json();
        chatBox.textContent += `Assistant: ${data.reply}\n`;

    } catch (err) {
        chatBox.textContent += `⚠️ Network error\n`;
    }
}

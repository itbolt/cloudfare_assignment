document.getElementById("sendBtn").addEventListener("click", sendMessage);
document.getElementById("inputBox").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  const input = document.getElementById("inputBox");
  const text = input.value.trim();
  if (!text) return;

  appendMessage("You", text);
  input.value = "";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
      appendMessage("⚠️ Server error", response.status);
      return;
    }

    const data = await response.json();
    appendMessage("AI", data.reply);

  } catch (err) {
    appendMessage("⚠️ Network error", err.message);
  }
}

function appendMessage(sender, msg) {
  const box = document.getElementById("chatBox");
  box.innerHTML += `<div><b>${sender}:</b> ${msg}</div>`;
  box.scrollTop = box.scrollHeight;
}

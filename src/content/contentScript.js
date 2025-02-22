// Inject AI autocomplete
(async function () {
  console.log("AI Autocomplete Content Script Loaded!");

  let enabled = true;

  chrome.storage.local.get(["enabled"], (data) => {
    enabled = data.enabled ?? true;
  });

  document.addEventListener("input", async (event) => {
    if (!enabled) return;

    const target = event.target;
    if (target.tagName !== "TEXTAREA" && target.tagName !== "INPUT") return;

    const text = target.value;
    if (!text) return;

    const response = await fetch("http://localhost:5000/autocomplete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    if (data.completion) {
      target.value = text + data.completion; // Basic implementation, can be enhanced
    }
  });
})();

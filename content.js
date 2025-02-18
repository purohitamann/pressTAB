let activeElement = null;

// Listen for keypresses in text inputs and textareas
document.addEventListener("focusin", (event) => {
  if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
    activeElement = event.target;
  }
});

document.addEventListener("keydown", async (event) => {
  if (!activeElement) return;

  const cursorPos = activeElement.selectionStart;
  const textBeforeCursor = activeElement.value.slice(0, cursorPos);

  if (event.key === "Tab") {
    event.preventDefault();
    acceptSuggestion();
  } else {
    requestSuggestion(textBeforeCursor);
  }
});

let suggestionText = "";

// Fetch AI suggestions
async function requestSuggestion(text) {
  if (text.length < 3) return; // Avoid spamming the AI with small inputs

  const response = await fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer YOUR_OPENAI_API_KEY`,
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: text,
      max_tokens: 10,
    }),
  });

  const data = await response.json();
  if (data.choices && data.choices[0].text) {
    suggestionText = data.choices[0].text.trim();
    displaySuggestion();
  }
}

// Display suggestion inline
function displaySuggestion() {
  if (!suggestionText || !activeElement) return;

  const currentText = activeElement.value;
  const cursorPos = activeElement.selectionStart;

  activeElement.value = currentText + suggestionText;
  activeElement.setSelectionRange(cursorPos, cursorPos + suggestionText.length);
}

// Accept suggestion when pressing Tab
function acceptSuggestion() {
  suggestionText = "";
}

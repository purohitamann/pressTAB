
// console.log("Gmail Autocomplete Extension Loaded");

// let lastInput = ""; // Track last input to prevent repeated requests
// let suggestion = ""; // Store the latest suggestion

// document.addEventListener("input", async (event) => {
//     const composeBox = document.querySelector('[aria-label="Message Body"]');

//     if (!composeBox) return;

//     const text = composeBox.innerText.trim();

//     if (text.length < 3 || text === lastInput) return;
//     lastInput = text;

//     console.log("Requesting suggestion for:", text);

//     try {
//         const response = await fetch("http://localhost:5001/autocomplete", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ text, context: "Gmail Compose" })
//         });

//         const data = await response.json();
//         suggestion = data.suggestion || "";

//         if (suggestion) {
//             showSuggestion(composeBox, text, suggestion);
//         }
//     } catch (error) {
//         console.error("Error fetching autocomplete:", error);
//     }
// });

// function showSuggestion(target, userText, suggestionText) {
//     // Remove any existing suggestion spans
//     const existingSuggestion = document.getElementById("autocomplete-suggestion");
//     if (existingSuggestion) existingSuggestion.remove();

//     if (!suggestionText.startsWith(userText)) {
//         suggestionText = userText + suggestionText;
//     }

//     // Create a span to show the suggestion in gray
//     const suggestionSpan = document.createElement("span");
//     suggestionSpan.id = "autocomplete-suggestion";
//     suggestionSpan.style.color = "gray";
//     suggestionSpan.style.opacity = "0.6"; // Light gray effect
//     suggestionSpan.style.userSelect = "none"; // Prevent selection
//     suggestionSpan.innerText = suggestionText.slice(userText.length); // Show only the new part

//     target.appendChild(suggestionSpan);
// }

// // Accept suggestion with "Tab"
// document.addEventListener("keydown", (e) => {
//     if (e.key === "Tab") {
//         e.preventDefault(); // Prevent default tab behavior
//         const composeBox = document.querySelector('[aria-label="Message Body"]');
//         if (composeBox && suggestion) {
//             composeBox.innerText += suggestion.slice(lastInput.length);
//             document.getElementById("autocomplete-suggestion")?.remove();
//             suggestion = ""; // Clear applied suggestion
//         }
//     }
// });

console.log("✅ Gmail AI Autocomplete Loaded");

let lastInput = ""; // Track last input to avoid redundant requests

document.addEventListener("input", async (event) => {
    const composeBox = document.querySelector('[aria-label="Message Body"]');

    if (!composeBox) return;

    const text = composeBox.innerText.trim();

    if (text.length < 3 || text === lastInput) return; 
    lastInput = text;

    console.log("🔎 Fetching suggestion for:", text);

    try {
        const response = await fetch("http://localhost:5001/autocomplete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        const suggestion = data.suggestion?.trim() || "";

        if (suggestion) {
            showSuggestion(composeBox, suggestion);
        }
    } catch (error) {
        console.error("❌ Error fetching autocomplete:", error);
    }
});

function showSuggestion(target, suggestion) {
    // Remove any existing suggestion
    const existing = document.querySelector(".ai-suggestion");
    if (existing) existing.remove();

    // Create suggestion span
    const suggestionSpan = document.createElement("span");
    suggestionSpan.classList.add("ai-suggestion");
    suggestionSpan.style.color = "gray";
    suggestionSpan.style.opacity = "0.6";
    suggestionSpan.innerText = " " + suggestion;

    // Append to Gmail compose box
    target.appendChild(suggestionSpan);

    // Accept suggestion on 'Tab'
    document.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            target.innerText += ` ${suggestion}`;
            suggestionSpan.remove();
        }
    });
}

let debounceTimer;

// Create the suggestion div that will be shown near the cursor (caret)
const suggestionDiv = document.createElement("div");
suggestionDiv.style.position = "absolute";
suggestionDiv.style.padding = "10px";
suggestionDiv.style.backgroundColor = "lightgray";
suggestionDiv.style.color = "black";
suggestionDiv.style.opacity = "0.8";
suggestionDiv.style.borderRadius = "5px";
suggestionDiv.style.fontSize = "14px";
suggestionDiv.style.display = "none"; // Initially hidden
suggestionDiv.style.cursor = "pointer"; // Makes the suggestion clickable
suggestionDiv.style.zIndex = "9999"; // Ensure it's above the compose box
document.body.appendChild(suggestionDiv);

document.addEventListener("input", async () => {
    clearTimeout(debounceTimer); // Reset debounce timer

    debounceTimer = setTimeout(async () => {
        const composeBox = document.querySelector(
            'div[aria-label="Message Body"][contenteditable="true"]'
        );
        const subjectBox = document.querySelector(
            'input[aria-label="Subject"]'
        );

        if (!composeBox) return;

        let text = composeBox.innerText.trim();
        let subject = subjectBox ? subjectBox.value.trim() : "";

        removeSuggestion(); // Remove old suggestion if user keeps typing

        if (text.length < 3 && subject.length < 3) {
            suggestionDiv.style.display = "none"; // Hide suggestion if both subject and body are short
            return;
        }

        console.log("Sending request for:", text, subject);

        try {
            const response = await fetch("http://localhost:5001/autocomplete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, subject }) // Send both subject and body
            });

            const data = await response.json();
            const suggestion = data.suggestion || "";

            if (suggestion) {
                showSuggestion(suggestion);
            }
        } catch (error) {
            console.error("Error fetching autocomplete:", error);
        }
    }, 300);
});

function showSuggestion(suggestion) {
    suggestionDiv.textContent = suggestion; // Update the suggestion text
    suggestionDiv.style.display = "block"; // Show the suggestion div
    positionSuggestionNearCaret();
}

// Function to position the suggestion div near the caret
function positionSuggestionNearCaret() {
    const composeBox = document.querySelector(
        'div[aria-label="Message Body"][contenteditable="true"]'
    );

    if (!composeBox) return;

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect(); // Get caret position

    // Calculate the position for the suggestion box (10px to the right and 5px below the caret)
    suggestionDiv.style.left = `${rect.left + window.scrollX + 10}px`;
    suggestionDiv.style.top = `${rect.top + window.scrollY + rect.height + 5}px`;
}

suggestionDiv.addEventListener("mouseover", () => {
    suggestionDiv.style.opacity = "1"; // Make it more visible on hover
});

suggestionDiv.addEventListener("mouseleave", () => {
    suggestionDiv.style.opacity = "0.8"; // Restore opacity when hover is removed
});

// Handle click on the suggestion div
suggestionDiv.addEventListener("click", () => {
    const composeBox = document.querySelector(
        'div[aria-label="Message Body"][contenteditable="true"]'
    );

    if (!composeBox) return;

    // Append the suggestion to the compose box
    composeBox.innerText += " " + suggestionDiv.textContent;
    removeSuggestion(); // Remove the suggestion div after selection
    moveCursorToEnd(composeBox); // Move the cursor to the end of the input
});

function removeSuggestion() {
    suggestionDiv.style.display = "none"; // Hide the suggestion div
}

function moveCursorToEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false); // Move to the end
    sel.removeAllRanges();
    sel.addRange(range);
}

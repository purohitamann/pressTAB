function getEmailComposer() {
    return document.querySelector("[role='textbox']");
}

function insertSuggestion(suggestion) {
    let emailComposer = getEmailComposer();
    if (!emailComposer) return;

    let currentText = emailComposer.innerText;
    emailComposer.innerText = currentText + suggestion;
}

// Monitor keystrokes
document.addEventListener("keydown", async (event) => {
    let emailComposer = getEmailComposer();
    if (!emailComposer || event.key !== "Tab") return;

    event.preventDefault();  // Prevent default tab behavior
    const userText = emailComposer.innerText.trim();
    if (!userText) return;

    let suggestion = await fetchGROQCompletion(userText);
    insertSuggestion(suggestion);
});

async function fetchGROQCompletion(inputText) {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage(
            { action: "fetchGROQCompletion", text: inputText },
            (response) => resolve(response.suggestion)
        );
    });
}

let currentSuggestion = "";

document.addEventListener("keydown", (event) => {
    let emailComposer = getEmailComposer();
    if (!emailComposer || !currentSuggestion) return;

    if (event.key === "Tab") {
        event.preventDefault();
        emailComposer.innerText += currentSuggestion; // Accept AI suggestion
        currentSuggestion = "";
    } else if (event.key === "Escape") {
        currentSuggestion = ""; // Dismiss AI suggestion
    }
});

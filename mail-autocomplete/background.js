chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Email Autocomplete Extension Installed!");
});

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchGROQCompletion") {
        fetchGROQCompletion(request.text)
            .then((completion) => sendResponse({ suggestion: completion }))
            .catch((error) => {
                console.error("Error fetching AI completion:", error);
                sendResponse({ suggestion: "" });
            });

        return true; // Keep the message channel open for async response
    }
});

// Function to call GROQ API
async function fetchGROQCompletion(inputText) {
    const API_URL = "https://api.groq.com/v1/completions"; // Ensure URL is correct

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getAPIKey()}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b",
                prompt: `Complete this email: ${inputText}`,
                max_tokens: 50
            })
        });

        const data = await response.json();
        console.log("GROQ Response:", data); // 🔍 Debugging Log

        return data.choices[0]?.text?.trim() || "";
    } catch (error) {
        console.error("Error fetching AI completion:", error);
        return "";
    }
}

// Function to retrieve API Key from Chrome Storage
async function getAPIKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(["groqApiKey"], (result) => {
            resolve(result.groqApiKey || "");
        });
    });
}

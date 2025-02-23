chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Email Autocomplete Extension Installed!");
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchGROQCompletion") {
        fetchGROQCompletion(request.text).then((completion) => {
            sendResponse({ suggestion: completion });
        });
        return true; // Keeps the message channel open for async response
    }
});
import Groq from "groq-sdk";

// Function to call GROQ API
async function fetchGROQCompletion(inputText) {
    const API_URL = "https://api.groq.com/v1/completions";
    const API_KEY = "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";  
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });// Store this securely!

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b",
                prompt: `Complete this email: ${inputText}`,
                max_tokens: 50
            })
        });

        const data = await response.json();
        return data.choices[0].text.trim();
    } catch (error) {
        console.error("Error fetching AI completion:", error);
        return "";
    }
}

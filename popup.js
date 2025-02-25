document.getElementById("save-api-key").addEventListener("click", () => {
    const apiKey = document.getElementById("api-key").value.trim();

    if (apiKey) {
        chrome.storage.sync.set({ groqApiKey: apiKey }, () => {
            document.getElementById("api-status").textContent = "API Key saved successfully!";
            console.log("API Key saved successfully!", apiKey);
        });
    } else {
        document.getElementById("api-status").textContent = "Please enter a valid API key.";
    }
});

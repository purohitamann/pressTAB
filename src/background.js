chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.storage.onChanged.addListener((changes) => {
  if ("enabled" in changes) {
    console.log("Extension enabled state:", changes.enabled.newValue);
  }
});

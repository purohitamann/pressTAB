console.log("📩 Gmail AI Extension Loaded!");

let emailBoxObserver = null;

function getEmailText() {
    const emailBox = document.querySelector('[aria-label="Message Body"]');

    if (emailBox) {
        console.log("✍ Email Text:", emailBox.innerText.trim());
    } else {
        console.warn("⚠ Gmail compose box not found! Retrying.. .");

        // Retry after 500ms if the box isn't found (Gmail loads dynamically)
        setTimeout(getEmailText, 500);
    }
}

// Detect when Gmail's compose box is focused
document.addEventListener("focusin", (event) => {
    const emailBox = document.querySelector('[aria-label="Message Body"]');

    if (event.target === emailBox) {
        console.log("📝 Gmail Compose Box Focused!");
        getEmailText();

        // Prevent multiple listeners
        if (!emailBoxObserver) {
            emailBoxObserver = new MutationObserver(getEmailText);
            emailBoxObserver.observe(emailBox, { childList: true, subtree: true });
        }
    }
});

// Detect when the compose box is closed and stop observing
document.addEventListener("focusout", (event) => {
    const emailBox = document.querySelector('[aria-label="Message Body"]');
    
    if (event.target === emailBox && emailBoxObserver) {
        console.log("❌ Gmail Compose Box Closed!");
        emailBoxObserver.disconnect();
        emailBoxObserver = null;
    }
});

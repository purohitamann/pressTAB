console.log("📩 Gmail AI Extension Loaded!");

function getEmailText() {
    const emailBox = document.querySelector('[aria-label="Message Body"]');

    if (emailBox) {
        console.log("✍ Email Text:", emailBox.textContent);

    } else {
        console.warn("⚠ Gmail compose box not found!");
    }
}

// Run when the user starts composing an email
document.addEventListener("focusin", (event) => {
    if (event.target.getAttribute("aria-label") === "Message Body") {
        console.log("📝 Gmail Compose Box Focused!");
        getEmailText();
        
        // Listen for changes in the email box
        event.target.addEventListener("input", getEmailText);
    }
});

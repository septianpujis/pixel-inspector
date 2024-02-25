chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toogleExtension") {
    // Handle background logic here, if necessary (e.g., storing state)
    sendResponse({ success: true });
  }
});

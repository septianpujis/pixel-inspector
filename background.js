chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toogleExtension") {
    sendResponse({ success: true });
  }
});

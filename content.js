function injectedFunction() {
  console.log(`hit`);
}

chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: [`popup/popup.js`],
  });
});

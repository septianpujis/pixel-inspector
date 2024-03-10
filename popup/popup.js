/**
 * extMainButton is a reference to the extension's main toggle button element.
 *
 * isExtensionEnabled tracks whether the extension is currently enabled or disabled.
 *
 * tabSwitches contains all the tab switch elements to change between different tabs.
 *
 * tabContents contains all the tab content elements that correspond to each tab.
 */

const extMainButton = document.getElementById("toggleButton");
var isExtensionEnabled = false;
const tabSwitches = document.querySelectorAll(".pi-tab-switch");
const tabContents = document.querySelectorAll(".pi-tab-content");

/**
 * Gets the extension's enabled state from chrome storage, updates the UI
 * based on this state, and sends a message to the content script to toggle
 * the extension on/off. Also updates the image and grid profile popups.
 */

chrome.storage.local.get("enabled", async (data) => {
  isExtensionEnabled = data.enabled || false; // Default to disabled if no data exists
  // extMainButton.textContent = isExtensionEnabled ? "On" : "Off";
  document.querySelector(`.pi-body`).style.display = isExtensionEnabled
    ? "block"
    : "none";
  chrome.storage.local.set({ enabled: isExtensionEnabled }, () => {});
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "toogleExtension",
    enabled: isExtensionEnabled,
  });
  updateImageProfilePopup();
  updateGridProfilePopup();
});

/**
 * Adds a click event listener to the extension's main toggle button.
 * Toggles the extension on/off by updating the button text, popup body display,
 * and extension enabled state in chrome storage. Sends a message to the content
 * script to toggle the extension on/off. If enabled, gets the selected image
 * and grid profiles from storage and updates their popups.
 */

extMainButton.addEventListener("click", async () => {
  isExtensionEnabled = !isExtensionEnabled;
  // extMainButton.textContent = isExtensionEnabled ? "On" : "Off";
  document.querySelector(`.pi-body`).style.display = isExtensionEnabled
    ? "block"
    : "none";

  chrome.storage.local.set({ enabled: isExtensionEnabled }, () => {});
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "toogleExtension",
    enabled: isExtensionEnabled,
  });
  if (isExtensionEnabled) {
    updateImageProfilePopup();
    updateGridProfilePopup();
    chrome.storage.local.get("selectedImageProfile", (data) => {
      selectedImageProfileId = data.selectedImageProfile || 0;
      selectImageProfil(selectedImageProfileId);
    });
    chrome.storage.local.get("selectedGridProfile", (data) => {
      selectedGridProfileId = data.selectedGridProfile || 0;
      selectGridProfil(selectedGridProfileId);
    });
  }
});

/**
 * Toggles visibility of tab content areas on tab button clicks.
 * Hides all tab content, shows #tab-image content by default.
 * Adds click handlers to tab buttons to toggle active tab.
 * Removes 'active' class from all buttons, adds 'active' to clicked.
 * Hides all tab content, shows content for selected tab target.
 */

tabContents.forEach((tab) => {
  tab.style.display = "none";
});
document.querySelector("#tab-image").style.display = "block";

tabSwitches.forEach((button) => {
  button.addEventListener("click", () => {
    tabSwitches.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    tabContents.forEach((tab) => {
      tab.style.display = "none";
    });

    const targetId = button.dataset.target;
    document.querySelector(`#${targetId}`).style.display = "block";
  });
});

// temporary function
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function sendMessage(object) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, object);
}

function showImageControlForm(id) {
  const imageControlForm = document.querySelector("#imageControlForm");
  imageControlForm.style.display = id ? "flex" : "none";
}
function showGridControlForm(id) {
  const gridControlForm = document.querySelector("#gridControlForm");
  gridControlForm.style.display = id ? "flex" : "none";
}

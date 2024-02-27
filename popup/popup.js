const extMainButton = document.getElementById("toggleButton");
var isExtensionEnabled = false;
const tabSwitches = document.querySelectorAll(".pi-tab-switch");
const tabContents = document.querySelectorAll(".pi-tab-content");

chrome.storage.sync.get("enabled", async (data) => {
  isExtensionEnabled = data.enabled || false; // Default to disabled if no data exists
  extMainButton.textContent = isExtensionEnabled ? "On" : "Off";
  document.querySelector(`.pi-body`).style.display = isExtensionEnabled
    ? "block"
    : "none";
  chrome.storage.sync.set({ enabled: isExtensionEnabled }, () => {});
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "toogleExtension",
    enabled: isExtensionEnabled,
  });
  updateImageProfilePopup();
  updateGridProfilePopup();
});

extMainButton.addEventListener("click", async () => {
  isExtensionEnabled = !isExtensionEnabled;
  extMainButton.textContent = isExtensionEnabled ? "On" : "Off";
  document.querySelector(`.pi-body`).style.display = isExtensionEnabled
    ? "block"
    : "none";

  chrome.storage.sync.set({ enabled: isExtensionEnabled }, () => {});
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "toogleExtension",
    enabled: isExtensionEnabled,
  });
  if (isExtensionEnabled) {
    chrome.storage.sync.get("selectedImageProfile", (data) => {
      selectedImageProfileId = data.selectedImageProfile || 0;
      selectImageProfil(selectedImageProfileId);
    });
    updateImageProfilePopup();
    updateGridProfilePopup();
  }
});

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

function getRandomColor() {
  // temporary function
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

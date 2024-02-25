const button = document.getElementById("toggleButton");
let isImageEnabled = false;

chrome.storage.sync.get("enabled", (data) => {
  isImageEnabled = data.enabled || false; // Default to disabled if no data exists
  button.textContent = isImageEnabled ? "On" : "Off";
  document.querySelector(`.pi-body`).style.display = isImageEnabled
    ? "block"
    : "none";
});

button.addEventListener("click", async () => {
  isImageEnabled = !isImageEnabled;
  button.textContent = isImageEnabled ? "On" : "Off";
  document.querySelector(`.pi-body`).style.display = isImageEnabled
    ? "block"
    : "none";

  chrome.storage.sync.set({ enabled: isImageEnabled }, () => {});
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "toggleImage",
    enabled: isImageEnabled,
  });
});

// Get tab switch buttons
const tabSwitches = document.querySelectorAll(".pi-tab-switch");

// Get tab content divs
const tabContents = document.querySelectorAll(".pi-tab-content");

// Hide all tab content divs by default
tabContents.forEach((tab) => {
  tab.style.display = "none";
});

// Show first tab content div
document.querySelector("#tab-image").style.display = "block";

// Click event handler for tab switch buttons
tabSwitches.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    tabSwitches.forEach((b) => b.classList.remove("active"));

    // Add active class to clicked button
    button.classList.add("active");

    // Hide all tab content divs
    tabContents.forEach((tab) => {
      tab.style.display = "none";
    });

    // Show tab content div with id from button data-target
    const targetId = button.dataset.target;
    document.querySelector(`#${targetId}`).style.display = "block";
  });
});

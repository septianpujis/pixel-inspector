const button = document.getElementById("toggleButton");
let isImageEnabled = false;

button.addEventListener("click", async () => {
  isImageEnabled = !isImageEnabled;
  button.textContent = isImageEnabled ? "Disable Image" : "Enable Image";
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "toggleImage",
    enabled: isImageEnabled,
  });
});

// Get tab switch buttons
const tabSwitches = document.querySelectorAll(".tab-switch");

// Get tab content divs
const tabContents = document.querySelectorAll(".tab-content");

// Hide all tab content divs by default
tabContents.forEach((tab) => {
  tab.style.display = "none";
});

// Show first tab content div
document.querySelector("#tab-a").style.display = "block";

// Click event handler for tab switch buttons
tabSwitches.forEach((button) => {
  button.addEventListener("click", () => {
    // Hide all tab content divs
    tabContents.forEach((tab) => {
      tab.style.display = "none";
    });

    // Show tab content div with id from button data-target
    const targetId = button.dataset.target;
    document.querySelector(`#${targetId}`).style.display = "block";
  });
});

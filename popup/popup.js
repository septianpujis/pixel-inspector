const extMainButton = document.getElementById("toggleButton");
let isExtensionEnabled = false;
const tabSwitches = document.querySelectorAll(".pi-tab-switch");
const tabContents = document.querySelectorAll(".pi-tab-content");

var imageProfile = [];
var gridProfile = [];

const imageAddBtn = document.getElementById("imageAddBtn");
var selectedImageProfileId = 0;

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
});

chrome.storage.sync.get("selectedImageProfile", (data) => {
  selectedImageProfileId = data.selectedImageProfile || 0;
  selectImageProfil(selectedImageProfileId);
});

function updateImageProfilePopup() {
  const imageProfiles = document.querySelectorAll(".pi-image-profile");

  for (let i = 0; i < imageProfiles.length; i++) {
    imageProfiles[i].remove();
  }

  imageProfile.forEach((profile) => {
    const imageDiv = document.createElement("div");
    imageDiv.classList.add("pi-image-profile");
    profile.active && imageDiv.classList.add("active");
    imageDiv.id = profile.id;
    imageDiv.addEventListener("click", () => {
      selectImageProfil(profile.id);
    });

    const img = document.createElement("img");
    img.src = profile.imageSrc;

    imageDiv.appendChild(img);

    document
      .querySelector(`#tab-image .pi-profile-wrapper`)
      .appendChild(imageDiv);
  });
}

chrome.storage.sync.get("imageProfile", (data) => {
  imageProfile = data.imageProfile || [];
  updateImageProfilePopup();
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
  const letters = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

imageAddBtn.addEventListener("click", async () => {
  const newImage = {
    id: Date.now(),
    imageSrc: `https://placehold.co/600x400/${getRandomColor()}/${getRandomColor()}?text=LOREM`,
    top: "0",
    left: "0",
    opacity: 1,
    active: true,
  };

  imageProfile.forEach((img) => {
    img.active = false;
  });

  imageProfile.push(newImage);
  chrome.storage.sync.set({ imageProfile: imageProfile }, () => {});
  selectImageProfil(newImage.id);
});

async function selectImageProfil(id) {
  selectedImageProfileId = id;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  imageProfile.forEach((profile) => {
    profile.active = profile.id === id;
  });

  chrome.storage.sync.set({ selectedImageProfile: id }, () => {});
  const selectedImage = imageProfile.filter((img) => img.id == id)[0];

  await chrome.tabs.sendMessage(tab.id, {
    action: "updateSelectedProfileImages",
    imageProfile: selectedImage,
  });
  imageXPosition.value = Number(selectedImage.left);
  imageYPosition.value = Number(selectedImage.top);
  updateImageProfilePopup();
}

const imageXPosition = document.getElementById("imageXPosition");
const imageYPosition = document.getElementById("imageYPosition");

imageXPosition.addEventListener("input", () => {
  imageProfile.forEach((profile) => {
    if (profile.id === selectedImageProfileId) {
      profile.left = imageXPosition.value;
    }
  });

  // chrome.storage.sync.set({ imageProfile });
  selectImageProfil(selectedImageProfileId);
});

imageYPosition.addEventListener("input", () => {
  imageProfile.forEach((profile) => {
    if (profile.id === selectedImageProfileId) {
      profile.top = imageYPosition.value;
    }
  });

  // chrome.storage.sync.set({ imageProfile });
  selectImageProfil(selectedImageProfileId);
});

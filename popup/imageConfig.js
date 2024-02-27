const imageAddBtn = document.getElementById("imageAddBtn");
const imageXPosition = document.getElementById("imageXPosition");
const imageYPosition = document.getElementById("imageYPosition");

var imageProfiles = [];
var selectedImageProfileId = 0;

chrome.storage.sync.get("selectedImageProfile", (data) => {
  selectedImageProfileId = data.selectedImageProfile || 0;
  selectImageProfil(selectedImageProfileId);
});

chrome.storage.sync.get("imageProfiles", (data) => {
  imageProfiles = data.imageProfiles || [];
  updateImageProfilePopup();
});

function updateImageProfilePopup() {
  const imageProfilelist = document.querySelectorAll(".pi-image-profile");

  if (imageProfilelist) {
    for (let i = 0; i < imageProfilelist.length; i++) {
      imageProfilelist[i].remove();
    }
  }

  imageProfiles.forEach((profile) => {
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

imageAddBtn.addEventListener("click", async () => {
  const newImage = {
    id: Date.now(),
    imageSrc: `https://placehold.co/600x400/${getRandomColor()}/${getRandomColor()}?text=LOREM`,
    top: "0",
    left: "0",
    opacity: 1,
    active: true,
  };

  imageProfiles.forEach((img) => {
    img.active = false;
  });

  imageProfiles.push(newImage);
  chrome.storage.sync.set({ imageProfiles: imageProfiles }, () => {});
  selectImageProfil(newImage.id);
});

async function selectImageProfil(id) {
  selectedImageProfileId = id;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  imageProfiles.forEach((profile) => {
    profile.active = profile.id === id;
  });

  chrome.storage.sync.set({ selectedImageProfile: id }, () => {});
  const selectedImage = imageProfiles.filter((img) => img.id == id)[0];

  await chrome.tabs.sendMessage(tab.id, {
    action: "updateSelectedProfileImages",
    imageProfile: selectedImage,
  });
  imageXPosition.value = Number(selectedImage.left);
  imageYPosition.value = Number(selectedImage.top);
  updateImageProfilePopup();
}

imageXPosition.addEventListener("input", () => {
  imageProfiles.forEach((profile) => {
    if (profile.id === selectedImageProfileId) {
      profile.left = imageXPosition.value;
    }
  });

  // chrome.storage.sync.set({ imageProfile });
  selectImageProfil(selectedImageProfileId);
});

imageYPosition.addEventListener("input", () => {
  imageProfiles.forEach((profile) => {
    if (profile.id === selectedImageProfileId) {
      profile.top = imageYPosition.value;
    }
  });

  // chrome.storage.sync.set({ imageProfile });
  selectImageProfil(selectedImageProfileId);
});

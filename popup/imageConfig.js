const imageAddBtn = document.getElementById("imageAddBtn");
const imageXPosition = document.getElementById("imageXPosition");
const imageYPosition = document.getElementById("imageYPosition");
const imageIsVisible = document.getElementById("imageIsVisible");
const imageOpacity = document.getElementById("imageOpacity");

const upArrow = document.getElementById("up-arrow");
const downArrow = document.getElementById("down-arrow");
const leftArrow = document.getElementById("left-arrow");
const rightArrow = document.getElementById("right-arrow");

var imageProfiles = [];
var selectedImageProfileId = 0;

chrome.storage.local.get("selectedImageProfile", (data) => {
  selectedImageProfileId = data.selectedImageProfile || 0;
  selectImageProfil(selectedImageProfileId);
});

chrome.storage.local.get("imageProfiles", (data) => {
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
    // Added close icon
    const closeIcon = document.createElement("div");
    closeIcon.classList.add("close-icon");
    closeIcon.innerHTML = "&times;";

    // Added click handler to delete profile
    closeIcon.addEventListener("click", function () {
      deleteImageProfile(profile.id);
    });

    imageDiv.appendChild(closeIcon);

    const img = document.createElement("img");
    img.src = profile.imageSrc;

    img.addEventListener("click", function () {
      selectImageProfil(profile.id);
    });

    imageDiv.appendChild(img);

    document
      .querySelector(`#tab-image .pi-profile-wrapper`)
      .appendChild(imageDiv);
  });
}

function deleteImageProfile(id) {
  imageProfiles = imageProfiles.filter((profile) => profile.id !== id);
  chrome.storage.local.set({ imageProfiles });
  updateImageProfilePopup();
  selectImageProfil(null);
}

imageAddBtn.addEventListener("click", async () => {
  //image upload goes here

  const newImage = {
    id: "image-" + Date.now(),
    imageSrc: `https://placehold.co/600x400/${getRandomColor()}/${getRandomColor()}?text=LOREM`,
    top: "0",
    left: "0",
    opacity: 0.5,
    isVisible: true,
    active: true,
  };

  imageProfiles.forEach((img) => {
    img.active = false;
  });

  imageProfiles.push(newImage);
  chrome.storage.local.set({ imageProfiles: imageProfiles }, () => {});
  selectImageProfil(newImage.id);
});

async function selectImageProfil(id) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  selectedImageProfileId = id;
  chrome.storage.local.set({ selectedImageProfile: id }, () => {});

  imageProfiles.forEach((profile) => {
    profile.active = profile.id === selectedImageProfileId;
  });

  const selectedImage = imageProfiles.filter((img) => img.id == id)[0];
  showImageControlForm(id);
  if (selectedImage) {
    imageIsVisible.checked = selectedImage.isVisible;
    imageOpacity.value = selectedImage.opacity;
    imageXPosition.value = Number(selectedImage.left);
    imageYPosition.value = Number(selectedImage.top);

    await chrome.tabs.sendMessage(tab.id, {
      action: "updateSelectedProfileImages",
      imageProfile: selectedImage,
    });
  } else {
    await chrome.tabs.sendMessage(tab.id, {
      action: "updateSelectedProfileImages",
      imageProfile: null,
    });
  }

  updateImageProfilePopup();
}

function updateImageLocalStorage(id) {
  chrome.storage.local.set({ imageProfiles });
  selectImageProfil(id);
}

function updateImageStyle(id, style, value) {
  imageProfiles.forEach((profile) => {
    if (profile.id === id) {
      switch (style) {
        case "isVisible":
          profile.isVisible = value;
          break;
        case "left":
          profile.left = value;
          break;
        case "top":
          profile.top = value;
          break;
        case "opacity":
          profile.opacity = value;
          break;
        default:
          throw new Error("Invalid style parameter");
      }
    }
  });
}

imageXPosition.addEventListener("input", () => {
  const leftValue = imageXPosition.value?.trim() || 0;

  updateImageStyle(selectedImageProfileId, "left", leftValue);
  updateImageLocalStorage(selectedImageProfileId);
});
imageYPosition.addEventListener("input", () => {
  const topValue = imageYPosition.value?.trim() || 0;

  updateImageStyle(selectedImageProfileId, "top", topValue);
  updateImageLocalStorage(selectedImageProfileId);
});

imageIsVisible.addEventListener("change", () => {
  updateImageStyle(selectedImageProfileId, "isVisible", imageIsVisible.checked);
  updateImageLocalStorage(selectedImageProfileId);
});

imageOpacity.addEventListener("input", () => {
  updateImageStyle(selectedImageProfileId, "opacity", imageOpacity.value);
  updateImageLocalStorage(selectedImageProfileId);
});

leftArrow.addEventListener("click", () => {
  updateImageStyle(
    selectedImageProfileId,
    "left",
    Number(imageXPosition.value) - 10
  );
  updateImageLocalStorage(selectedImageProfileId);
});

rightArrow.addEventListener("click", () => {
  updateImageStyle(
    selectedImageProfileId,
    "left",
    Number(imageXPosition.value) + 10
  );
  updateImageLocalStorage(selectedImageProfileId);
});

upArrow.addEventListener("click", () => {
  updateImageStyle(
    selectedImageProfileId,
    "top",
    Number(imageYPosition.value) - 10
  );
  updateImageLocalStorage(selectedImageProfileId);
});

downArrow.addEventListener("click", () => {
  updateImageStyle(
    selectedImageProfileId,
    "top",
    Number(imageYPosition.value) + 10
  );
  updateImageLocalStorage(selectedImageProfileId);
});

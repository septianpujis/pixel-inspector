const gridAddBtn = document.getElementById("gridAddBtn");
const gridWidth = document.getElementById("gridWidth");
const gridGap = document.getElementById("gridGap");
const gridAmount = document.getElementById("gridAmount");
const gridColor = document.getElementById("gridColor");
const gridOpacity = document.getElementById("gridOpacity");

var gridProfiles = [];
var selectedGridProfileId = 0;

chrome.storage.local.get("gridProfiles", (data) => {
  gridProfiles = data.gridProfiles || [];
  updateGridProfilePopup();
});

chrome.storage.local.get("selectedGridProfile", (data) => {
  selectedGridProfileId = data.selectedGridProfile || 0;
  selectGridProfil(selectedGridProfileId);
});

function updateGridProfilePopup() {
  const gridProfileList = document.querySelectorAll(".pi-grid-profile");

  if (gridProfileList) {
    for (let i = 0; i < gridProfileList.length; i++) {
      gridProfileList[i].remove();
    }
  }

  gridProfiles.forEach((profile) => {
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("pi-grid-profile");
    profile.active && gridDiv.classList.add("active");
    gridDiv.id = profile.id;
    gridDiv.addEventListener("click", function () {
      selectGridProfil(profile.id);
    });

    // Added close icon
    const closeIcon = document.createElement("div");
    closeIcon.classList.add("close-icon");
    closeIcon.innerHTML = "&times;";

    // Added click handler to delete profile
    closeIcon.addEventListener("click", function () {
      deleteGridProfile(profile.id);
    });

    gridDiv.appendChild(closeIcon);

    // Added color square
    const colorSquare = document.createElement("div");
    colorSquare.style.width = "20px";
    colorSquare.style.height = "20px";
    colorSquare.style.backgroundColor = profile.color;

    const title = document.createElement("p");
    title.innerText = profile.name;

    gridDiv.appendChild(colorSquare);
    gridDiv.appendChild(title);

    document
      .querySelector(`#tab-grid .pi-profile-wrapper`)
      .appendChild(gridDiv);
  });
}

gridAddBtn.addEventListener("click", async () => {
  const newGrid = {
    id: Date.now(),
    width: "1200",
    gap: "24",
    amount: "12",
    color: "#" + getRandomColor(),
    opacity: 0.4,
    name: "1200px" + "12 column" + "24px gap",
    active: true,
  };

  gridProfiles.forEach((data) => {
    data.active = false;
  });

  gridProfiles.push(newGrid);

  chrome.storage.local.set({ gridProfiles: gridProfiles }, () => {});
  selectGridProfil(newGrid.id);
});

function deleteGridProfile(id) {
  gridProfiles = gridProfiles.filter((profile) => profile.id !== id);
  chrome.storage.local.set({ gridProfiles });
  updateGridProfilePopup();
  selectGridProfil(null);
}

async function selectGridProfil(id) {
  selectedGridProfileId = id;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  gridProfiles.forEach((profile) => {
    profile.active = profile.id === id;
  });

  chrome.storage.local.set({ selectedGridProfile: id }, () => {});
  const selectedGrid = gridProfiles.filter((data) => data.id == id)[0];

  if (selectedGrid) {
    await chrome.tabs.sendMessage(tab.id, {
      action: "updateSelectedProfileGrid",
      gridProfile: selectedGrid,
    });
    gridWidth.value = Number(selectedGrid.width);
    gridGap.value = Number(selectedGrid.gap);
  } else {
    await chrome.tabs.sendMessage(tab.id, {
      action: "updateSelectedProfileGrid",
      gridProfile: null,
    });
  }

  updateGridProfilePopup();
}

async function updateGridProfileValues({ name, value }) {
  gridProfiles.forEach((profile) => {
    if (profile.id === selectedGridProfileId) {
      profile[name] = value;
    }
  });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, {
    action: "updateSelectedProfileGrid",
    gridProfile: selectedGrid,
  });

  chrome.storage.local.set({ gridProfiles }, () => {
    selectGridProfil(selectedGridProfileId);
  });
}

gridWidth.addEventListener("input", () => {
  gridProfiles.forEach((profile) => {
    if (profile.id === selectedGridProfileId) {
      profile.left = gridWidth.value;
    }
  });

  chrome.storage.local.set({ gridProfile });

  selectGridProfil(selectedGridProfileId);
});

gridGap.addEventListener("input", () => {
  gridProfiles.forEach((profile) => {
    if (profile.id === selectedGridProfileId) {
      profile.top = gridGap.value;
    }
  });

  chrome.storage.local.set({ gridProfile });
  selectGridProfil(selectedGridProfileId);
});

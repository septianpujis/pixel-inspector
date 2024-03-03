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

    // Added close icon
    const closeIcon = document.createElement("div");
    closeIcon.classList.add("close-icon");
    closeIcon.innerHTML = "&times;";

    // Added click handler to delete profile
    closeIcon.addEventListener("click", function () {
      deleteGridProfile(profile.id);
    });

    const flexDiv = document.createElement("div");
    flexDiv.classList.add("info");

    flexDiv.addEventListener("click", function () {
      selectGridProfil(profile.id);
    });
    // Added color square
    const colorSquare = document.createElement("div");
    colorSquare.style.width = "20px";
    colorSquare.style.height = "20px";
    colorSquare.style.backgroundColor = profile.color;

    const title = document.createElement("p");
    title.innerText = profile.name;

    flexDiv.appendChild(colorSquare);
    flexDiv.appendChild(title);

    gridDiv.appendChild(flexDiv);
    gridDiv.appendChild(closeIcon);

    document
      .querySelector(`#tab-grid .pi-profile-wrapper`)
      .appendChild(gridDiv);
  });
}

gridAddBtn.addEventListener("click", async () => {
  const newGrid = {
    id: "grid-" + Date.now(),
    width: "1200",
    gap: "24",
    amount: "12",
    color: "#" + getRandomColor(),
    isVisible: false,
    opacity: 0.4,
    name: "1200px" + ", 12 column" + ", 24px gap",
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

  showGridControlForm(id);

  if (selectedGrid) {
    gridWidth.value = Number(selectedGrid.width);
    gridGap.value = Number(selectedGrid.gap);
    gridAmount.value = Number(selectedGrid.amount);
    gridOpacity.value = Number(selectedGrid.opacity);
    gridColor.value = selectedGrid.color;

    await chrome.tabs.sendMessage(tab.id, {
      action: "updateSelectedProfileGrid",
      gridProfile: selectedGrid,
    });
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

function updateGridLocalStorage(id) {
  chrome.storage.local.set({ gridProfiles });
  selectGridProfil(id);
}

function updateGridStyle(id, style, value) {
  gridProfiles.forEach((profile) => {
    if (profile.id === id) {
      switch (style) {
        case "isVisible":
          profile.isVisible = value;
          break;
        case "width":
          profile.width = value;
          break;
        case "gap":
          profile.gap = value;
          break;
        case "opacity":
          profile.opacity = value;
          break;
        case "amount":
          profile.amount = value;
          break;
        case "color":
          profile.color = value;
          break;
        default:
          throw new Error("Invalid style parameter");
      }
    }
  });
}
gridWidth.addEventListener("input", () => {
  const width = gridWidth.value?.trim() || 0;
  updateGridStyle(selectedGridProfileId, "width", width);
  updateGridLocalStorage(selectedGridProfileId);
});

gridGap.addEventListener("input", () => {
  const gap = gridGap.value?.trim() || 0;
  updateGridStyle(selectedGridProfileId, "gap", gap);
  updateGridLocalStorage(selectedGridProfileId);
});

gridOpacity.addEventListener("input", () => {
  updateGridStyle(selectedGridProfileId, "opacity", gridOpacity.value);
  updateGridLocalStorage(selectedGridProfileId);
});

gridAmount.addEventListener("input", () => {
  const amount = gridAmount.value?.trim() || 0;
  updateGridStyle(selectedGridProfileId, "amount", amount);
  updateGridLocalStorage(selectedGridProfileId);
});

gridColor.addEventListener("input", () => {
  const color = gridColor.value?.trim() || 0;
  updateGridStyle(selectedGridProfileId, "color", color);
  updateGridLocalStorage(selectedGridProfileId);
});

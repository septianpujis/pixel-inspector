const gridAddBtn = document.getElementById("gridAddBtn");
const gridWidth = document.getElementById("gridWidth");
const gridGap = document.getElementById("gridGap");
const gridAmount = document.getElementById("gridAmount");
const gridColor = document.getElementById("gridColor");
const gridOpacity = document.getElementById("gridOpacity");

var gridProfiles = [];
var selectedGridProfileId = 0;

chrome.storage.sync.get("selectedGridProfile", (data) => {
  selectedGridProfileId = data.selectedGridProfile || 0;
  selectGridProfil(selectedGridProfileId);
});

chrome.storage.sync.get("gridProfiles", (data) => {
  gridProfiles = data.gridProfiles || [];
  updateGridProfilePopup();
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
    gridDiv.addEventListener("click", () => {
      selectGridProfil(profile.id);
    });

    const title = document.createElement("p");
    title.innerText =
      profile.width + " - " + profile.amount + " - " + profile.gap;

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
    active: true,
  };

  gridProfiles.forEach((data) => {
    data.active = false;
  });

  gridProfiles.push(newGrid);
  chrome.storage.sync.set({ gridProfiles: gridProfiles }, () => {});
  selectGridProfil(newGrid.id);
});

async function selectGridProfil(id) {
  selectedGridProfileId = id;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  gridProfiles.forEach((profile) => {
    profile.active = profile.id === id;
  });

  chrome.storage.sync.set({ selectedGridProfile: id }, () => {});
  const selectedGrid = gridProfiles.filter((data) => data.id == id)[0];

  await chrome.tabs.sendMessage(tab.id, {
    action: "updateSelectedProfileGrid",
    gridProfile: selectedGrid,
  });
  //   gridWidth.value = Number(selectedGrid.width);
  //   gridGap.value = Number(selectedGrid.gap);
  updateGridProfilePopup();
}

// gridWidth.addEventListener("input", () => {
//   gridProfiles.forEach((profile) => {
//     if (profile.id === selectedGridProfileId) {
//       profile.left = gridWidth.value;
//     }
//   });

//   chrome.storage.sync.set({ gridProfile });
//   selectGridProfil(selectedGridProfileId);
// });

// gridGap.addEventListener("input", () => {
//   gridProfiles.forEach((profile) => {
//     if (profile.id === selectedGridProfileId) {
//       profile.top = gridGap.value;
//     }
//   });

//   chrome.storage.sync.set({ gridProfile });
//   selectGridProfil(selectedGridProfileId);
// });

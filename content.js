chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toogleExtension") {
    const pixelInspectorParent = document.createElement("div");
    pixelInspectorParent.setAttribute("id", "pixelInspectorParent");

    const pixelInspectorImageOverlay = document.createElement("div");
    pixelInspectorImageOverlay.setAttribute("id", "pixelInspectorImageOverlay");

    const pixelInspectorGridOverlay = document.createElement("div");
    pixelInspectorGridOverlay.setAttribute("id", "pixelInspectorGridOverlay");
    pixelInspectorGridOverlay.style.position = "absolute";
    pixelInspectorGridOverlay.style.left = "50%";
    pixelInspectorGridOverlay.style.top = "0px";
    pixelInspectorGridOverlay.style.transform = "translateX(-50%)";
    pixelInspectorGridOverlay.style.display = "flex";
    pixelInspectorGridOverlay.style.height = "100%";

    pixelInspectorParent.appendChild(pixelInspectorImageOverlay);
    pixelInspectorParent.appendChild(pixelInspectorGridOverlay);

    if (message.enabled) {
      if (!document.getElementById("pixelInspectorParent")) {
        document.body.appendChild(pixelInspectorParent);
      }
    } else {
      if (document.getElementById("pixelInspectorParent")) {
        document.getElementById("pixelInspectorParent").remove();
      }
    }
  }

  if (message.action === "updateSelectedProfileImages") {
    const img = document.createElement("img");
    img.src = message.imageProfile.imageSrc;
    img.style.position = "absolute";
    img.style.left = "calc(50% + " + message.imageProfile.left + "px)";
    img.style.transform = "translate(-50%)";
    img.style.top = message.imageProfile.top + "px";
    img.alt = message.imageProfile.id;
    img.id = message.imageProfile.id;

    const pixelInspectorImageOverlay = document.getElementById(
      "pixelInspectorImageOverlay"
    );

    if (pixelInspectorImageOverlay) {
      const existingImages = pixelInspectorImageOverlay.querySelectorAll("img");
      for (let i = 0; i < existingImages.length; i++) {
        existingImages[i].remove();
      }
      pixelInspectorImageOverlay.appendChild(img);
    }
  }

  if (message.action === "updateSelectedProfileGrid") {
    const gridBar = document.createElement("div");
    gridBar.style.background = message.gridProfile.color;
    gridBar.style.height = "100%";
    gridBar.style.flex = "1 1 100%";

    const pixelInspectorGridOverlay = document.getElementById(
      "pixelInspectorGridOverlay"
    );

    if (pixelInspectorGridOverlay) {
      pixelInspectorGridOverlay.style.width = message.gridProfile.width + "px";
      pixelInspectorGridOverlay.style.gap = message.gridProfile.gap + "px";
      pixelInspectorGridOverlay.style.opacity = message.gridProfile.opacity;

      const existingGrids = pixelInspectorGridOverlay.querySelectorAll("div");
      for (let i = 0; i < existingGrids.length; i++) {
        existingGrids[i].remove();
      }

      for (let i = 0; i < Number(message.gridProfile.amount); i++) {
        pixelInspectorGridOverlay.appendChild(gridBar.cloneNode(true));
      }
    }
  }
});

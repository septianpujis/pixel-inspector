chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toogleExtension") {
    const pixelInspectorParent = document.createElement("div");
    pixelInspectorParent.setAttribute("id", "pixelInspectorParent");

    const pixelInspectorImageOverlay = document.createElement("div");
    pixelInspectorImageOverlay.setAttribute("id", "pixelInspectorImageOverlay");

    const pixelInspectorGridOverlay = document.createElement("div");
    pixelInspectorGridOverlay.setAttribute("id", "pixelInspectorGridOverlay");

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
});

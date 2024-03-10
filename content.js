chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.message == "chooseFile") {
    var fileChooser = document.createElement("input");
    fileChooser.type = "file";
    fileChooser.accept = "image/*";

    fileChooser.addEventListener("change", function () {
      var file = fileChooser.files[0];

      if (!file.type.startsWith("image/")) {
        return;
      }

      var reader = new FileReader();
      reader.onload = function () {
        chrome.storage.local.get("imageProfiles", function (result) {
          const imageProfiles = result.imageProfiles || [];

          const selectedProfile = imageProfiles.filter(
            (profile) => profile.id === message.profileId
          );

          if (selectedProfile) {
            selectedProfile[0].imageSrc = reader.result;
            chrome.storage.local.set(
              { imageProfiles: imageProfiles },
              () => {}
            );
          }
        });
      };
      reader.readAsDataURL(file);

      form.reset();
    });

    /* Wrap it in a form for resetting */
    var form = document.createElement("form");
    form.appendChild(fileChooser);

    fileChooser.click();
  }

  if (message.action === "toogleExtension") {
    const pixelInspectorParent = document.createElement("div");
    pixelInspectorParent.setAttribute("id", "pixelInspectorParent");

    const pixelInspectorImageOverlay = document.createElement("div");
    pixelInspectorImageOverlay.setAttribute("id", "pixelInspectorImageOverlay");

    const pixelInspectorGridOverlay = document.createElement("div");
    pixelInspectorGridOverlay.setAttribute("id", "pixelInspectorGridOverlay");
    pixelInspectorGridOverlay.style.position = "fixed";
    pixelInspectorGridOverlay.style.left = "50%";
    pixelInspectorGridOverlay.style.top = "0px";
    pixelInspectorGridOverlay.style.display = "flex";
    pixelInspectorGridOverlay.style.height = "100%";
    pixelInspectorGridOverlay.style.zIndex = "214748364";
    pixelInspectorGridOverlay.style.transform = "translateX(-50%)";

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
    const pixelInspectorImageOverlay = document.getElementById(
      "pixelInspectorImageOverlay"
    );
    if (pixelInspectorImageOverlay) {
      const existingImages = pixelInspectorImageOverlay.querySelectorAll("img");
      for (let i = 0; i < existingImages.length; i++) {
        existingImages[i].remove();
      }
    }

    if (message.imageProfile) {
      const img = document.createElement("img");
      img.src = message.imageProfile.imageSrc;

      img.style.pointerEvents = "none";
      img.style.zIndex = "214748364";
      img.style.position = "absolute";
      img.style.left = "calc(50% + " + message.imageProfile.left + "px)";
      img.style.transform = `translate(-50%) scale(${
        (message.imageProfile.scale, 1)
      })`;

      if (message.imageProfile.top === null) {
        img.style.top = "0px";
      } else {
        img.style.top = `${message.imageProfile.top}px`;
      }

      img.style.opacity = message.imageProfile.isVisible
        ? message.imageProfile.opacity
        : 0;
      img.alt = message.imageProfile.id;
      img.id = message.imageProfile.id;

      if (pixelInspectorImageOverlay) {
        pixelInspectorImageOverlay.appendChild(img);
      }
    }
  }

  if (message.action === "updateSelectedProfileGrid") {
    const pixelInspectorGridOverlay = document.getElementById(
      "pixelInspectorGridOverlay"
    );
    if (pixelInspectorGridOverlay) {
      const existingGrids = pixelInspectorGridOverlay.querySelectorAll("div");
      for (let i = 0; i < existingGrids.length; i++) {
        existingGrids[i].remove();
      }
    }
    if (message.gridProfile) {
      const gridBar = document.createElement("div");
      gridBar.style.background = message.gridProfile.color;
      gridBar.style.height = "100%";
      gridBar.style.flex = "1 1 100%";

      if (pixelInspectorGridOverlay) {
        pixelInspectorGridOverlay.style.width =
          message.gridProfile.width + "px";
        pixelInspectorGridOverlay.style.gap = message.gridProfile.gap + "px";
        pixelInspectorGridOverlay.style.opacity = message.gridProfile.opacity;

        for (let i = 0; i < Number(message.gridProfile.amount); i++) {
          pixelInspectorGridOverlay.appendChild(gridBar.cloneNode(true));
        }
      }
    }
  }
});

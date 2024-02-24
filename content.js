chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleImage") {
    const image = document.createElement("img");
    image.setAttribute("id", "imageExtension");
    image.src = "https://placehold.co/600x400"; // Replace with your image URL
    image.style.position = "absolute";
    image.style.zIndex = 9999;
    image.style.top = "0";
    image.style.left = "0";

    if (message.enabled) {
      if (!document.getElementById("imageExtension")) {
        document.body.appendChild(image);
      }
    } else {
      document.getElementById("imageExtension").remove();
    }
  }
});

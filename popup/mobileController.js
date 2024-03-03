// Make the DIV element draggable:
dragElement(document.getElementById("touch-area"));

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    imageXPosition.value -= pos1;
    imageYPosition.value -= pos2;
    imageProfiles.forEach((profile) => {
      if (profile.id === selectedImageProfileId) {
        profile.left = imageXPosition.value;
        profile.top = imageYPosition.value;
      }
    });
    updateImageLocalStorage(selectedImageProfileId);
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    elmnt.style.top = "50%";
    elmnt.style.left = "50%";
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

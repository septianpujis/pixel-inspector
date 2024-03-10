function init() {
  mouseCtrl({
    n: "imageXPosition",
    getCtrl: getFloatCtrl,
    setCtrl: scaledIntCtrl,
    isNegative: false,
    style: "left",
    type: "image",
  });
  mouseCtrl({
    n: "imageYPosition",
    getCtrl: getFloatCtrl,
    setCtrl: scaledIntCtrl,
    isNegative: false,
    style: "top",
    type: "image",
  });
  mouseCtrl({
    n: "gridWidth",
    getCtrl: getFloatCtrl,
    setCtrl: scaledIntCtrl,
    isNegative: true,
    style: "width",
    type: "grid",
  });
  mouseCtrl({
    n: "gridAmount",
    getCtrl: getFloatCtrl,
    setCtrl: scaledIntCtrl,
    isNegative: true,
    style: "amount",
    type: "grid",
  });
  mouseCtrl({
    n: "gridGap",
    getCtrl: getFloatCtrl,
    setCtrl: scaledIntCtrl,
    isNegative: true,
    style: "gap",
    type: "grid",
  });
}
function getFloatCtrl(o) {
  return parseFloat(o.value);
}
function getIntCtrl(o) {
  return parseInt(o.value);
}
function mouseCtrl({ n, getCtrl, setCtrl, isNegative = false, style, type }) {
  var ctrl; // DOM object for the input control
  var startpos; // starting mouse position
  var startval; // starting input control value
  // find the input element to allow mouse control on
  ctrl = document.getElementById(n);
  // on mousedown start tracking mouse relative position
  ctrl.onmousedown = function (e) {
    startpos = e.clientX;
    startval = getCtrl(ctrl);
    if (isNaN(startval)) startval = 0;
    document.onmousemove = function (e) {
      var delta = Math.ceil(e.clientX - startpos);
      setCtrl(ctrl, startval, delta, isNegative, style, type);
    };
    document.onmouseup = function () {
      document.onmousemove = null; // remove mousemove to stop tracking
    };
  };
}

// takes current value and relative mouse coordinate as arguments
function scaledIntCtrl(o, i, x, isNegative, s, type) {
  var incVal = Math.round(Math.sign(x) * Math.pow(Math.abs(x) / 10, 1.6));
  var newVal = i + incVal;
  if (isNegative && newVal < 0) newVal = 0;
  o.value = newVal;
  if (type === "image")
    updateImagebyDrag(selectedImageProfileId, s, Number(o.value));
  if (type === "grid")
    updateGridbyDrag(selectedGridProfileId, s, Number(o.value));
}

function updateImagebyDrag(id, style, value) {
  updateImageStyle(id, style, value);
  updateImageLocalStorage(id);
}
function updateGridbyDrag(id, style, value) {
  updateGridStyle(id, style, value);
  updateGridLocalStorage(id);
}

if (window.addEventListener) {
  /*W3C*/ window.addEventListener("load", init, false);
} else if (window.attachEvent) {
  /*MS*/ window.attachEvent("onload", init);
} else {
  /*def*/ window.onload = init;
}

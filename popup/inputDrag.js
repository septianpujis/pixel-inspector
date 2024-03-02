function init() {
  mouseCtrl("imageXPosition", getFloatCtrl, scaledIntCtrl);
  mouseCtrl("imageYPosition", getFloatCtrl, scaledIntCtrl);
  mouseCtrl("gridWidth", getFloatCtrl, scaledIntCtrl, true);
  mouseCtrl("gridAmount", getFloatCtrl, scaledIntCtrl, true);
  mouseCtrl("gridGap", getFloatCtrl, scaledIntCtrl, true);
}
function getFloatCtrl(o) {
  return parseFloat(o.value);
}
function getIntCtrl(o) {
  return parseInt(o.value);
}
function mouseCtrl(n, getCtrl, setCtrl, isNegative = false) {
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
      setCtrl(ctrl, startval, delta, isNegative);
    };
    document.onmouseup = function () {
      document.onmousemove = null; // remove mousemove to stop tracking
    };
  };
}

// takes current value and relative mouse coordinate as arguments
function scaledIntCtrl(o, i, x, isNegative) {
  var incVal = Math.round(Math.sign(x) * Math.pow(Math.abs(x) / 10, 1.6));
  var newVal = i + incVal;
  if (isNegative && newVal < 0) newVal = 0;
  if (Math.abs(incVal) > 1) o.value = newVal; // allow small deadzone
}

if (window.addEventListener) {
  /*W3C*/ window.addEventListener("load", init, false);
} else if (window.attachEvent) {
  /*MS*/ window.attachEvent("onload", init);
} else {
  /*def*/ window.onload = init;
}

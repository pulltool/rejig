(function(){

var scales = [1,2];
var iconSize = 19;
var sheetWidth = 6;

var spriteImage = document.createElement('img');
spriteImage.src = '/images/sprites.svg';

scaleCtxs = [];
scales.forEach(function(scale) {
  var spriteCanvas = document.createElement('canvas');
  spriteCanvas.width = spriteImage.width * scale;
  spriteCanvas.height = spriteImage.height * scale;

  scaleCtxs[scale] = spriteCanvas.getContext('2d');
  scaleCtxs[scale].drawImage(spriteImage, 0, 0,
    spriteCanvas.width, spriteCanvas.height);
}

function getFrame(i) {
  var x = i % sheetWidth;
  var y = Math.floor(i / sheetWidth);
  var dict = {};
  scales.forEach(function(scale) {
    var renderSize = iconSize * scale;
    var left = x * renderSize;
    var top = y * renderSize;

    dict[renderSize] = scaleCtxs[scale].getImageData(
      left, top, renderSize, renderSize);
  });
  return dict;
}

var spinterval = null;
function spinIcon() {
  var frame = 0;
  function advanceFrame() {
    ++frame;
    var displayFrame = frame < 36 ? frame : 36 + (frame % 36);
    chrome.browserAction.setIcon({imageData: getFrame(displayFrame)});
  }
  spinterval = setInterval(advanceFrame,20)
}

function stopIcon() {
  clearInterval(spinterval); spinterval = null;
  chrome.browserAction.setIcon({path: {
    "19": "images/icon-19.png",
    "38": "images/icon-38.png"
  }});
}

function toggleSpinning() {
  if (spinterval) stopIcon(); else spinIcon();
}

chrome.browserAction.onClicked.addListener(toggleSpinning);
})();

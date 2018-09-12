// in order for window.setLedgerLoopsChannel to exist in web pages, we need
// to inject a script tag that creates it.
// This injected script calls postMessage to send the info to us, the
// content script:
var elt = document.createElement('script');
elt.innerHTML = `\
window.setLedgerLoopsChannel = function(chan){\
  window.postMessage({ type: "LedgerLoops", text: chan }, '*');\
};\
console.log("LedgerLoops browser extension created window.setLedgerLoopsChannel");`
document.head.appendChild(elt);

// once the injected script is in place, we, the content script, can wait
// for the message, and pass it on to the background script (background.js)
// if it arrives:
window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source == window && event.data.type == 'LedgerLoops') {
    chrome.runtime.sendMessage(event.data);
  }
}, false);

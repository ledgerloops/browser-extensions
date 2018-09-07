var elt = document.createElement('script');
elt.innerHTML = 'window.setLedgerLoopsChannel = function(chan){' +
                '  window.postMessage({ type: "LedgerLoops", text: chan }, "*");' +
                '};' +
                'console.log("LedgerLoops API loaded!");' +
                'console.log("Try `window.setLedgerLoopsChannel(\'wss://unicurn.com/asdfasfrweds\');`");';
document.head.appendChild(elt);

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source === window && event.data.type && event.data.type === 'LedgerLoops') {
    console.log('LedgerLoops channel set, waiting for user to click the browser extension icon...');
    chrome.runtime.onConnect.addListener(function(port) {
      console.log('connected, setting channel!');
      port.postMessage(event.data.text);
    });
  }
}, false);

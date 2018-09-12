var elt = document.createElement('script');
elt.innerHTML = `\
window.setLedgerLoopsChannel = function(chan){\
  chrome.runtime.sendMessage('${chrome.runtime.id}', \
    { type: "LedgerLoops", text: chan },\
    function (response) { console.log('extension responded', response);\
  });\
};\
console.log("LedgerLoops API loaded!");\
console.log("Try window.setLedgerLoopsChannel('ws://localhost:8000');");`
document.head.appendChild(elt);

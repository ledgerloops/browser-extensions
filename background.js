var agent = new LedgerLoops.Agent('reader');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  agent.ensurePeer(sender.url, request.text);
});
console.log('background script is loaded');

var agent = new LedgerLoops.Agent('me');
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got request!', request, sender);
  if (request.text) {
    agent.ensurePeer(sender.url, request.text);
  } else {
    const ledgers = {};
    for (let peer in agent._ledgers) {
      ledgers[peer] = {
        balance: agent._ledgers[peer].getBalance(),
        committed: agent._ledgers[peer]._committed,
        pending: agent._ledgers[peer]._pending
      };
    }
    sendResponse({ ledgers });
  }
});
console.log('background script is loaded');

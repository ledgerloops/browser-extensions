var agent = new LedgerLoops.Agent('reader'); // FIXME: see https://github.com/ledgerloops/ledgerloops/issues/24
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got request!', request, sender);
  if (request.text) {
    agent.ensurePeer(sender.url, request.text);
    setInterval(() => {
      let donation = agent._ledgers[sender.url].create(1);
      agent._ledgers[sender.url].send(donation);
    }, 5000);
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

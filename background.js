var agent = new LedgerLoops.Agent('reader'); // FIXME: see https://github.com/ledgerloops/ledgerloops/issues/24
if (typeof browser === 'undefined') {
  browser = chrome
}
browser.storage.local.get(['ledgers']).then(results => {
  const { ledgers } = results;
  console.log('got ledgers from storage', ledgers);
  if (ledgers === undefined) {
    return;
  }
  for (let peer in ledgers) {
    console.log('inflating peer', ledgers[peer]);
    agent.ensurePeer(peer, ledgers[peer].channel);
    agent._peerHandlers[peer]._channel = ledgers[peer].channel;
    agent._peerHandlers[peer]._ledger._committed = ledgers[peer].committed;
    agent._peerHandlers[peer]._ledger._pending = ledgers[peer].pending;
    agent._peerHandlers[peer]._ledger._currentBalance = ledgers[peer].balanceDetails;
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got request!', request, sender);
  if (request.text) {
    agent.ensurePeer(sender.url, request.text);
    agent._peerHandlers[sender.url]._channel = request.text;
    setInterval(() => {
      let donation = agent._peerHandlers[sender.url].create(1);
      agent._peerHandlers[sender.url].send(donation);
    }, 5000);
  } else {
    const ledgers = {};
    for (let peer in agent._peerHandlers) {
      ledgers[peer] = {
        channel: agent._peerHandlers[peer]._channel,
        balance: agent._peerHandlers[peer].getBalance(),
        balanceDetails: agent._peerHandlers[peer]._ledger._currentBalance,
        committed: agent._peerHandlers[peer]._ledger._committed,
        pending: agent._peerHandlers[peer]._ledger._pending
      };
    }
    browser.storage.local.set({ ledgers }).then(() => {
      console.log('ledgers stored!');
    });
    sendResponse({ ledgers });
  }
});
console.log('background script is loaded');

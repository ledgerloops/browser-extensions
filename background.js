var agent = new LedgerLoops.Agent('reader'); // FIXME: see https://github.com/ledgerloops/ledgerloops/issues/24
browser.storage.local.get(['ledgers']).then(ledger => {
  for (let peer in ledgers) {
    console.log('inflating peer', ledger[peer]);
    agent.ensurePeer(peer, ledgers[peer].channel);
    agent._peerHandlers[peer]._ledger._committed = ledger[peer].committed;
    agent._peerHandlers[peer]._ledger._pending = ledger[peer].pending;
    agent._peerHandlers[peer]._ledger._currentBalance = ledger[peer].balanceDetails;
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got request!', request, sender);
  if (request.text) {
    agent.ensurePeer(sender.url, request.text);
    agent._peerHandlers[peer]._channel = request.text;
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

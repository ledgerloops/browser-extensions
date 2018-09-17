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

function pay(url, amount, recurring) {
  if (!agent._peerHandlers[url]) {
    console.log('Cannot pay non-ledger', url);
    return;
  }
  const doPay = () => {
    let msg = agent._peerHandlers[url].create(amount);
    agent._peerHandlers[url].send(msg);
  };
  if (recurring) {
    setInterval(doPay, 5000);
  }
  doPay();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log('got request!', request, sender);
  if (request.text) {
    agent.ensurePeer(sender.url, request.text);
    agent._peerHandlers[sender.url]._channel = request.text;
  } else {
    switch(request.cmd) {
      case 'getLedgers': {
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
        pay(sender.url, 0.0001, true); // default donation
        break;
      }
      case 'pay': {
        pay(request.currentUrl, request.amount, request.recurring);
        break;
      }
      case 'request': {
        pay(request.currentUrl, -request.amount, request.recurring);
        break;
      }
    }
  }
});
console.log('background script is loaded');

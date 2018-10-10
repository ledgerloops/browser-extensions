var agent = new LedgerLoops.Agent('reader'); // FIXME: see https://github.com/ledgerloops/ledgerloops/issues/24
if (typeof browser === 'undefined') {
  browser = chrome
}
// browser.storage.local.get(['ledgers']).then(results => {
//   const { ledgers } = results;
//   console.log('got ledgers from storage', ledgers);
//   if (ledgers === undefined) {
//     return;
//   }
//   for (let peerName in ledgers) {
//     console.log('inflating peer', ledgers[peer]);
//     agent.addClient({
//       peerName,
//       peerUrl: ledgers[peer].channel
//     });
//     // agent._peerHandlers[peer]._channel = ledgers[peer].channel;
//     // agent._peerHandlers[peer]._ledger._committed = ledgers[peer].committed;
//     // agent._peerHandlers[peer]._ledger._pending = ledgers[peer].pending;
//     // agent._peerHandlers[peer]._ledger._currentBalance = ledgers[peer].balanceDetails;
//   }
// });

function pay(url, amount, recurring) {
  const doPay = () => {
    agent.addTransaction(url, amount);
  };
  if (recurring) {
    setInterval(doPay, 5000);
  }
  doPay();
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log('got request!', request, sender);
  if (request.ledgerloopsChannel) {
    console.log('client adding!', request);
    agent.addClient({
      peerName: sender.url,
      peerUrl: request.ledgerloopsChannel
    });
  } else {
    switch(request.cmd) {
      case 'getLedger': {
        const ledger = {
          transactions: agent.getTransactions(),
          balances: agent.getBalances()
        };
//        browser.storage.local.set({ ledger }).then(() => {
//          console.log('ledger stored!', ledger);
//        });
        sendResponse({ ledger });
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

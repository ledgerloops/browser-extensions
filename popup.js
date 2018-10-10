var currentUrl;

function formatDate(msAgo) {
  let value = msAgo;
  function toString(unit) {
    return Math.floor(value) + unit + ' ago';
  }
  if (value < 1000) { return toString('ms'); }
  value/=1000;
  if (value < 60) { return toString('s'); }
  value/=60;
  if (value < 60) { return toString('m'); }
  value/=60;
  if (value < 24) { return toString('h'); }
  value/=24;
  if (value < 365) { return toString('d'); }
  value/=365;
  return toString('y');
}

function displayLedger(ledger) {
  let html = '<table><tr><td><h2>Balances:</h2><ul>';
  console.log(ledger.balances);
  for (let peerName in ledger.balances) {
    html += `<li>${peerName}: ` +
      ledger.balances[peerName].current + ' +[' +
      ledger.balances[peerName].receivable + '] -[' +
      ledger.balances[peerName].payable + ']</li>';
  }
  html += '</ul></td><td><h2>Transaction:</h2>';
  console.log(html, ledger.transactions);
  for (let channelName in ledger.transactions) {
    html += '<h3>' + channelName + '</h3><ul>';
    for (let msgId in ledger.transactions[channelName]) {
      const transaction = ledger.transactions[channelName][msgId];
      if (transaction.status == 'accepted') {
        html += `<li>${transaction.request.msgId}: ${transaction.request.amount} (${transaction.request.unit})</li>`;
      } else if (transaction.status == 'pending') {
        html += `<li><em>[${transaction.request.msgId}: ${transaction.request.amount} (${transaction.request.unit})]</em></li>`;
      }
    }
    html += '</ul>';
  }
  html += '</td></tr></table>';
  document.getElementById('ledger').innerHTML = html;
  // for(i in clickers) {
  //   document.getElementById(`link-${i}`).onclick = function() {
  //     currentUrl = clickers[i]
  //     chrome.tabs.update({ url: currentUrl });
  //     displayLedger(ledgers, currentUrl);
  //   };
  // }
}

function pay() {
  const amount = parseFloat(document.getElementById('amount').value);
  const recurring = document.getElementById('recurring').checked;
  console.log('Pay!', { amount, recurring, currentUrl });
  chrome.runtime.sendMessage({ cmd: 'pay', amount, recurring, currentUrl }, function (response) {
    console.log('Paid!', { amount, recurring, response, currentUrl });
  });
};

function request() {
  const amount = parseFloat(document.getElementById('amount').value);
  const recurring = document.getElementById('recurring').checked;
  console.log('Requesting!', { amount, recurring, currentUrl });
  chrome.runtime.sendMessage({ cmd: 'request', amount, recurring, currentUrl }, function (response) {
    console.log('Requested!', { amount, recurring, response, currentUrl });
  });
};

function updateUI() {
  console.log('updating ui!');
  chrome.runtime.sendMessage({ cmd: 'getLedger' }, function (response) {
    console.log(response);
    displayLedger(response.ledger);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('pay-button').onclick = pay;
  document.getElementById('request-button').onclick = request;
  document.getElementById('ledger').innerHTML = 'popup script loaded';
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    currentUrl = tabs[0].url;
    console.log({ currentUrl });
    setInterval(updateUI, 1000);
  });
});

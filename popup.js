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
  let html = '<table class="table table-hover"> <thead> <tr> <th scope="col">Account</th> <th scope="col">Current</th> <th scope="col">Payable</th> <th scope="col">Receivable</th> </tr> </thead> <tbody>';
  console.log(ledger.balances);
  for (let peerName in ledger.balances) {
    if (peerName == 'bank') {
      html += '<tr class="table-primary">';
    } else {
      html += '<tr class="table-active">';
    }
    html += `<th scope="row">${peerName}</th><td>` +
      ledger.balances[peerName].current + '</td><td>' +
      ledger.balances[peerName].receivable + '</td><td>' +
      ledger.balances[peerName].payable + '</td></tr>';
  }
  html += '</tbody></table>';
  html += '<table class="table table-hover"> <thead> <tr> <th scope="col">From</th> <th scope="col">To</th> <th scope="col">Amount</th> <th scope="col">Unit</th> <th scope="col">Date</th> </tr> </thead> <tbody>';
  console.log(html, ledger.transactions);
  for (let channelName in ledger.transactions) {
    const parts = channelName.split('-');
    for (let msgId in ledger.transactions[channelName]) {
      const transaction = ledger.transactions[channelName][msgId];
      if (transaction.status == 'accepted') {
        html += '<tr class="table-active">';
      } else if (transaction.status == 'pending') {
        html += '<tr class="table-primary">';
      }
      html += `<td>${parts[0]}</td><td>${parts[1]}</td>` +
        `<td>${transaction.request.amount}</td>` +
        `<td>${transaction.request.unit}</td>` +
        `<td>?</td></tr>`;
    }
  }
  html += '</tbody></table>';
  document.getElementById('ledger').innerHTML = html;
  // for(i in clickers) {
  //   document.getElementById(`link-${i}`).onclick = function() {
  //     currentUrl = clickers[i]
  //     chrome.tabs.update({ url: currentUrl });
  //     displayLedger(ledgers, currentUrl);
  //   };
  // }
}

function getAmount() {
  let amount = parseFloat(document.getElementById('amount').value);
  if (isNaN(amount)) {
    document.getElementById('amount').value = "1.0";
    amount = 1.0;
  }
  return amount;
}
  
function pay() {
  const amount = getAmount();
  const recurring = document.getElementById('recurring').checked;
  console.log('Pay!', { amount, recurring, currentUrl });
  chrome.runtime.sendMessage({ cmd: 'pay', amount, recurring, currentUrl }, function (response) {
    console.log('Paid!', { amount, recurring, response, currentUrl });
  });
};

function request() {
  const amount = getAmount();
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

let memory = {};
document.addEventListener('DOMContentLoaded', function() {
  console.log(memory);
  document.getElementById('ledger').innerHTML = 'popup script loaded';
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    currentUrl = tabs[0].url;
    document.getElementById('paying').style.display = 'block';
    document.getElementById('site-name').innerText = currentUrl;
    document.getElementById('pay-button').onclick = pay;
    document.getElementById('request-button').onclick = request;
    console.log({ currentUrl });
    setInterval(updateUI, 1000);
  });
});

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
  console.log('got request in popup!', req, sender);
  if (req.ledgerloopsChannel) {
    document.getElementById('paying').style.display = 'block';
    document.getElementById('site-name').innerText = sender.url;
    document.getElementById('pay-button').onclick = pay;
    document.getElementById('request-button').onclick = request;
    memory = 'yes'
  } else {
    // document.getElementById('paying').style.display = 'none';
    memory = 'no'
  }
});

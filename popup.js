function displayLedgers(ledgers) {
  var html = '';
  let loops = {};
  html += `<p>Ledgers:</p><ul>`;
  for (var neighbor in ledgers) {
    html += `<li>Ledger with ${neighbor}: ${ledgers[neighbor].balance}<ul>`;
    let k;
    for (k in ledgers[neighbor].committed) {
      const entry = ledgers[neighbor].committed[k];
      html += `<li><strong>Entry ${k}: ${entry.msgType} ${entry.beneficiary} ${entry.amount}</strong></li>`;
      if (entry.msgType === 'COND') {
        if (!loops[entry.routeId]) {
          loops[entry.routeId] = {
          };
        }
        if (entry.sender == 'me') {
          loops[entry.routeId].fside = entry.beneficiary;
        } else {
          loops[entry.routeId].cside = entry.sender;
        }
      }
    }
    for (k in ledgers[neighbor].pending) {
      const entry = ledgers[neighbor].pending[k];
      html += `<li>(entry ${k}: ${entry.msgType} ${entry.beneficiary} ${entry.amount})</li>`;
    }
    html += '</ul></li>';
  }
  html += `</ul>`;
  for (let routeId in loops) {
    html += `<h2>Loop ${routeId}:</h2>\
<p>${loops[routeId].cside} -> me -> ${loops[routeId].fside}</p>`;
  }
  document.getElementById('ledgers').innerHTML = html;
}



document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('ledgers').innerHTML = 'popup script loaded';
  chrome.runtime.sendMessage({ cmd: 'getLedgers' }, function (response) {
    displayLedgers(response.ledgers);
  });
});

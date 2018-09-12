// var agent = new LedgerLoops.Agent('reader', true);
// 
// function setChildTextNode(elementId, text) {
//   document.getElementById(elementId).innerText = text;
// }
// 
// function connect(bloggerSocket) {
//   console.log('agent created');
//   agent.ensurePeer('blogger', bloggerSocket)
//   console.log('peer ensured');
//   var donation = agent._ledgers.blogger.create(1);
//   console.log('donation created');
//   setTimeout(() => {
//     console.log('waited 1000ms');
//     agent._ledgers.blogger.send(donation);
//     console.log('donation sent');
//   }, 1000);
// }
// 
// document.addEventListener('DOMContentLoaded', function() {
//   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//     var port = chrome.tabs.connect(tabs[0].id);
//     port.onMessage.addListener(function getResp(response) {
//       setChildTextNode("resultsConnect", response);
//       connect(response);
//     });
//   });
// });
// 
// function displayAgents() {
//   var html = '';
//   let loops = {};
//   html += `<p>Ledgers:</p><ul>`;
//   for (var neighbor in agent._ledgers) {
//     html += `<li>Ledger with ${neighbor}: ${agent._ledgers[neighbor].getBalance()}<ul>`;
//     let k;
//     for (k in agent._ledgers[neighbor]._committed) {
//       const entry = agent._ledgers[neighbor]._committed[k];
//       html += `<li><strong>Entry ${k}: ${entry.msgType} ${entry.beneficiary} ${entry.amount}</strong></li>`;
//       if (entry.msgType === 'COND') {
//         if (!loops[entry.routeId]) {
//           loops[entry.routeId] = {
//             start: entry.sender
//           };
//         }
//         loops[entry.routeId][entry.sender] = entry.beneficiary;
//       }
//     }
//     for (k in agent._ledgers[neighbor]._pending) {
//       const entry = agent._ledgers[neighbor]._pending[k];
//       html += `<li>(entry ${k}: ${entry.msgType} ${entry.beneficiary} ${entry.amount})</li>`;
//     }
//     html += '</ul></li>';
//   }
//   html += `</ul>`;
//   for (let routeId in loops) {
//     html += `<h2>Loop ${routeId}:</h2><p>`;
//     let cursor = loops[routeId].start;
//     do {
//       html += `-> ${cursor}`;
//       cursor = loops[routeId][cursor];
//       if (!cursor) {
//         break;
//       }
//     } while (cursor != loops[routeId].start);
//     html += '</p>';
//   }
//   document.getElementById('data').innerHTML = html;
// }
// setInterval(displayAgents, 1000);

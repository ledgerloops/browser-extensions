function setChildTextNode(elementId, text) {
  document.getElementById(elementId).innerText = text;
}

function connect(bloggerSocket) {
  var agent = new LedgerLoops.Agent('reader', true);
  console.log('agent created');
  agent.ensurePeer('blogger', bloggerSocket)
  console.log('peer ensured');
  var donation = agent._ledgers.blogger.create(1);
  console.log('donation created');
  setTimeout(() => {
    console.log('waited 1000ms');
    agent._ledgers.blogger.send(donation);
    console.log('donation sent');
  }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.onMessage.addListener(function getResp(response) {
      setChildTextNode("resultsConnect", response);
      connect(response);
    });
  });
});

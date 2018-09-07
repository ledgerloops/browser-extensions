function setChildTextNode(elementId, text) {
  document.getElementById(elementId).innerText = text;
}

document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var port = chrome.tabs.connect(tabs[0].id);
    port.onMessage.addListener(function getResp(response) {
      setChildTextNode("resultsConnect", response);
    });
  });
});

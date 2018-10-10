window.onload = function () {
  const ledgerloopsChannel = Array.from(document.getElementsByTagName('link')).filter(x => x.rel == 'ledger').map(x => x.href)[0]
  if (ledgerloopsChannel) {
    chrome.runtime.sendMessage({ ledgerloopsChannel });
  }
};

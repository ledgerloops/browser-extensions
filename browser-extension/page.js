console.log('waiting for dom to load!');
window.onload = function () {
  console.log('dom loaded!');
  const ledgerloopsChannel = Array.from(document.getElementsByTagName('link')).filter(x => x.rel == 'ledger').map(x => x.href)[0]
  console.log({ ledgerloopsChannel });
  if (ledgerloopsChannel) {
    chrome.runtime.sendMessage({ ledgerloopsChannel });
  }
};

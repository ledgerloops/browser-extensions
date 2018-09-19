console.log('waiting for dom to load!');
window.onload = function () {
  console.log('dom loaded!');
  const ledgerloopsChannel = Array.from(document.getElementsByTagName('link')).filter(x => x.rel == 'ledger').map(x => x.href)[0]
  console.log({ flattrId, ledgerloopsChannel });
  if (flattrId) {
    chrome.runtime.sendMessage({ flattrId, ledgerloopsChannel });
  }
};

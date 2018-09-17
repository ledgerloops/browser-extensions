console.log('waiting for dom to load!');
window.onload = function () {
  console.log('dom loaded!');
  const flattrId = Array.from(document.getElementsByTagName('meta')).filter(x => x.name == 'flattr:id').map(x => x.content)[0]
  const ledgerloopsChannel = Array.from(document.getElementsByTagName('link')).filter(x => x.rel == 'ledgerloops:channel').map(x => x.href)[0]
  console.log({ flattrId, ledgerloopsChannel });
  if (flattrId) {
    chrome.runtime.sendMessage({ flattrId, ledgerloopsChannel });
  }
};

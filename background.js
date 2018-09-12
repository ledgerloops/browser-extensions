chrome.runtime.onMessageExternal.addListener(function(req, sender, sendRes) {
  console.log('got msg, finally!', req);
});

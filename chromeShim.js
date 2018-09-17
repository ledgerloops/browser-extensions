// In Firefox, we can access browsers.tabs and browser.storage.
// In Chrome, there is no global variable called 'browser', but
// there is one called 'chrome', which has almost the same functions,
// so if 'browser.*' is not defined, use 'chrome.*' instead:
if (typeof browser === 'undefined') {
  browser = {
    tabs: {
      onUpdated: chrome.tabs.onUpdated,
      query: options => new Promise(resolve => chrome.tabs.query(options, resolve)),
      create: chrome.tabs.create,
    },
    notifications: chrome.notifications,
    storage: {
      local: {
        get: keys => new Promise(resolve => chrome.storage.local.get(keys, resolve)),
        set: values => new Promise(resolve => chrome.storage.local.set(values, resolve)),
      },
    },
    pageAction: chrome.pageAction,
  };
}

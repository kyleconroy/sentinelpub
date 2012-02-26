// The current active URL
currentWebsite = {};

var formatDate = function(date) {
  return date.getTime() / 1000;
}


var changeCurrentUrl = function(tab) {
  if (tab == undefined)
    return;

  if (tab.url) {
    domain = tab.url.replace('http://','').replace('https://','');
    domain = domain.replace('www.','').split(/[/?#]/)[0];
  } else {
    domain = "";
  }

  if (currentWebsite.domain == domain) {
    return;
  }

  if (currentWebsite.domain) {
    currentWebsite.end = formatDate(new Date());
    $.ajax({
      type: 'POST',
      url: "http://localhost:9045/log",
      data: currentWebsite,
      dataType: "json"
    })
  }
    
  currentWebsite = {
    "start": formatDate(new Date()),
    "domain": domain
  }
};

chrome.tabs.onSelectionChanged.addListener(function(tabId, selectInfo) {
  chrome.tabs.get(tabId, function(tab) {
    changeCurrentUrl(tab);
  });
});

chrome.windows.onFocusChanged.addListener(function(windowId) {
  if (windowId < 0) {
    changeCurrentUrl({});
    return;
  }

  chrome.tabs.getSelected(windowId, function(tab) {
    changeCurrentUrl(tab);
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.tabs.getSelected(tab.windowId, function(currentTab) {
    if (currentTab.id == tabId && currentTab.status == "complete") {
      changeCurrentUrl(tab);
    }
  });
});

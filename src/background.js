// Function to reduce volume in all tabs
function reduceTabVolumes(tabId) {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
        if(tabId !== tab.id) {
            chrome.tabs.executeScript(tab.id, {
              code: "Array.from(document.getElementsByTagName('video')).forEach(function(video) { video.volume = 0.1; });"
            });
        }
      });
    });
    chrome.tabs.executeScript(tabId, {
        code: "Array.from(document.getElementsByTagName('video')).forEach(function(video) { video.volume = 1; });"
      });
}

function restoreTabVolumes() {
    chrome.tabs.query({}, function (tabs) {
      tabs.forEach(function (tab) {
            chrome.tabs.executeScript(tab.id, {
              code: "Array.from(document.getElementsByTagName('video')).forEach(function(video) { video.volume = 1; });"
            });
      });
    });
}
  
  
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, _) {
    if (changeInfo.audible) {
        chrome.tabs.get(tabId, function(tab) {
            if(tab.active)
            {
                reduceTabVolumes(tabId)
            }
        })
    } else if (!changeInfo.audible) {
        restoreTabVolumes()
    }
});

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        if (tab.audible) {
            reduceTabVolumes(activeInfo.tabId);
        }
    });
});
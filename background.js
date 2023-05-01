let refreshIntervalId = null;
let autoRefreshStarted = false;

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({ refreshInterval: 5 });
});

function setRefreshInterval(seconds) {
  chrome.storage.local.set({ refreshInterval: seconds });
  console.log(`Refresh interval set to ${seconds} seconds`);
}

function stopAutoRefresh() {
  clearInterval(refreshIntervalId);
  autoRefreshStarted = false;
  console.log("Auto Refresh stopped");
}

function startAutoRefresh() {
	chrome.storage.local.get(["refreshInterval"], function (result) {
	  console.log("Auto Refresh started");
	  autoRefreshStarted = true;
	  refreshIntervalId = setInterval(function () {
		chrome.tabs.getSelected(null, function(tab) {
			if (tab) {
				var code = 'window.location.reload(true);';
				chrome.tabs.executeScript(tab.id, {code: code});
			} else {
				console.log("No active tabs found");
			}
		});
	  }, result.refreshInterval * 1000);
	});
  }

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "startAutoRefresh") {
    startAutoRefresh();
  } else if (request.message === "stopAutoRefresh") {
    stopAutoRefresh();
  } else if (request.message === "setRefreshInterval") {
    setRefreshInterval(request.seconds);
  }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && autoRefreshStarted) {
    chrome.tabs.executeScript(tabId, { file: "content.js" });
  }
});
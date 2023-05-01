const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const setButton = document.getElementById("setButton");
const refreshTime = document.getElementById("refreshTime");

startButton.addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "startAutoRefresh" });
});

stopButton.addEventListener("click", function () {
  chrome.runtime.sendMessage({ message: "stopAutoRefresh" });
});

setButton.addEventListener("click", function () {
  const seconds = refreshTime.value;
  chrome.runtime.sendMessage({ message: "setRefreshInterval", seconds });
});

chrome.storage.local.get(["refreshInterval"], function (result) {
  refreshTime.value = result.refreshInterval;
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "autoRefreshStarted") {
    startButton.disabled = true;
    stopButton.disabled = false;
    setButton.disabled = true;
    refreshTime.disabled = true;
  } else if (request.message === "autoRefreshStopped") {
    startButton.disabled = false;
    stopButton.disabled = true;
    setButton.disabled = false;
    refreshTime.disabled = false;
  }
});
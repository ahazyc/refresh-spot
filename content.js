chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log('(content.js) message received:', request.message);
  if (request.message === "reload") {
    window.location.reload(true);
  }
});

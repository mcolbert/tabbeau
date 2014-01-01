function Links() {
  var anchors = document.getElementsByClassName('app-anchor');

  anchors[0].addEventListener('click', function handleClick() {
    chrome.tabs.getCurrent(function updateTab(tab) {
      chrome.tabs.update(tab.id, {url: 'chrome://apps/'});
    });
  });

  anchors[1].addEventListener('click', function handleClick() {
    chrome.tabs.getCurrent(function updateTab(tab) {
      chrome.tabs.update(tab.id, {url: 'chrome://bookmarks/'});
    });
  });
}

new Links();

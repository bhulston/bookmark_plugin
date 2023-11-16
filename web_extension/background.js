console.log("Background running");
//Receiving information from content scraping script

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.article == true) {
      wordCount = message.words;
      readingTime = message.time;
      chrome.runtime.sendMessage({ readSuccess: true, wordCount: wordCount, readingTime: readingTime }); //Send to popup.js
    } if (message.article == false) {
      chrome.runtime.sendMessage({ readSuccess: false, wordCount: "NA", readingTime: "NA" });
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.options == true) {
    options = message.cache;
    console.log("Cache loaded in:", options);
    sendResponse();
  }
  
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.header == true) {
      title = message.title;

      chrome.runtime.sendMessage({ headSuccess: true, title: title }); //Send to popup.js

    } if (message.header == false) {
      chrome.runtime.sendMessage({ headSuccess: false, title: "Example Title" });
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.author == true) {
      author = message.authorID;
      console.log("article has an author");
      console.log("The author is", author);

      chrome.runtime.sendMessage({ authorSuccess: true, authorID: author }); //Send to popup.js

    } if (message.author == false) {
      chrome.runtime.sendMessage({ authorSuccess: false, author: "Not Found" });
      console.log("tab has no header");
    }
    sendResponse();
});

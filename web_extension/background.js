console.log("Background running");
//Receiving information from content scraping script

console.log("testing utils import");

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${oldValue}", new value is "${newValue}".`
    );
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {  
  if (message.content == true) {
      console.log("'Content' message received in background.js:", message);
      wordCount = message.words;
      readingTime = message.time;
      chrome.runtime.sendMessage({ readSuccess: true, wordCount: wordCount, readingTime: readingTime }); //Send to popup.js
    } if (message.content == false) {
      chrome.runtime.sendMessage({ readSuccess: false, wordCount: "NA", readingTime: "NA" });
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.options == true) {
    console.log("'Options' message received in background.js:", message);
    options = message.cache;
    console.log("Cache loaded in:", options);
    sendResponse();
  }
  
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.header == true) {
      console.log("'Title' message received in background.js:", message);
      title = message.title;

      chrome.runtime.sendMessage({ headSuccess: true, title: title }); //Send to popup.js

    } if (message.header == false) {
      chrome.runtime.sendMessage({ headSuccess: false, title: "Example Title" });
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.author == true) {
      console.log("'Author' message received in background.js:", message);
      author = message.authorID;
      console.log("The author is", author);

      chrome.runtime.sendMessage({ authorSuccess: true, authorID: author }); //Send to popup.js

    } if (message.author == false) {
      chrome.runtime.sendMessage({ authorSuccess: false, author: "Not Found" });
      console.log("tab has no header");
    }
    sendResponse();
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.scrapelog) {
      scrapelog = message.scrapelog;
      console.log("Scraper log:", scrapelog);
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.success === false) {
      error = message.error;
      console.log("Scraper error:", error);
    }
    sendResponse();
});


//TODO: Add error handling for scrapers to popup.js. -- Scraper Error Handlind --
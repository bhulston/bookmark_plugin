console.log("Background running");

let wordCount = 0;
let readingTime = 0;
let videoTime = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.words !== undefined && message.time !== undefined) {
      wordCount = message.words;
      readingTime = message.time;
      console.log("Background received word count and reading time:", wordCount, readingTime);
    }
    sendResponse();
});
















// // Initialize variables to 0
// let wordCount = 0;
// let readingTime = 0;

// // Listen for messages from the content script
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.wordCount) {
//       wordCount = message.wordCount;
//       console.log("Received word count:", wordCount);
//     }
//     if (message.readingTime) {
//       readingTime = message.readingTime;
//       console.log("Received reading time:", readingTime);
//     }
  
//     sendResponse();
//   });

// // Listen for messages from the popup script
// chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
//     if (message.requestWordCount && message.from == "popup") {
//       console.log("Message Received");
// // Send the word count to the popup script
//         chrome.runtime.sendMessage({ msg: "requestWordCount", from: 'popup' }, function (response) {
//             console.log("Message from background sent to content");
//             console.log(response);
//             if (response == "Content Saved") {
//                 console.log("Content Saved");
//                 sendResponse("Content Saved");
//             }
//             else { 
//                 console.log("Content not saved");
//                 sendResponse("Save failed"); 
//             }
//         })
//     }
// });


//   (async () => {
//     const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
//     const response = await chrome.tabs.sendMessage(tab.id, {greeting: "hello"});
//     // do something with response here, not outside the function
//     console.log(response);
//   })();

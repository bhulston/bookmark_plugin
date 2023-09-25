
console.log("This is a popup!");
//Popup script handles queries that do not interact with the base DOM of the webpage.
//These are run on the ccurrent tab each time a popup window is opened


import { injectContentScript, getVideoID, handleSuccess, checkURL } from '../utils.js';

// Popup HTML elements
let elmUrl = document.getElementById("url"); 
let elmTitle = document.getElementById("title");
let elmInfo3 = document.getElementById("info3");
let elmInfo4 = document.getElementById("info4");

let elmValue3 = document.getElementById("value3");
let elmValue4 = document.getElementById("value4");

// Query GoogleAPI for Youtube video information and activate content script if not from youtube
    //runs on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Set URL
    const url = tabs[0].url;
    console.log("url=", url);
    elmUrl.innerText = `${url}`; // Update URL element
    console.log("tab=", tabs[0]);

    const type = checkURL(url);

    if (type == "youtube") {
        elmInfo3.innerText = "Watch Duration:"
        elmInfo4.innerText = "Channel Title:"

        //Parse for video information
        const videoID = getVideoID(url);
        const key = "AIzaSyBmSKHmSYhdEB2usaHT0zFFzXosu4J2Y0k";
        let url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + key +"&part=snippet,contentDetails";
        
        //Execute scripts
        const data = fetch(url1).then(function(response) {
            console.log("response =", response);
            if (!response.ok) {
                throw new Error('Network response was not ok'); //hitting here:/
            }
            return response.json(); // Assuming the response is in JSON format
        }).then(function(data){
            handleSuccess(data, elmTitle, elmValue3, elmValue4)
        }).catch(function(error) {
            console.error('Error:', error);
        });
    } else {
    // Need to use a content script to roead DOM contained information (word count and reading time)
        injectContentScript(tabs[0]); 
    }
  });



// Listeners for Content info
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Act when content script reads relevant info
    if ( message.readSuccess == true ) {
      elmInfo3.innerText = "Reading Time:"
      elmInfo4.innerText = "Page Author:"
    //   wordCount = message.wordCount;
      const readingTime = message.readingTime;
      elmValue3.value = `${readingTime} minutes`;

      console.log("article info extracted");

    } if ( message.readSuccess = false ) {
      elmInfo3.innerText = "Reading Time:"
      elmInfo4.innerText = "Page Author:"

    //   wordCount = message.wordCount;
      const readingTime = message.readingTime;
      elmValue3.value = readingTime;

      console.log("info not extracted");
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Act when content script reads relevant info
    if ( message.headSuccess == true ) {
      elmTitle.value = message.title;

    } if ( message.headSuccess = false ) {
      elmTitle.value = message.title;
    }
    sendResponse();
});
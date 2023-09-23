console.log("This is a popup!");
//Popup script handles queries that do not interact with the base DOM of the webpage.


// Defining functions
injectContentScript = (tab) => {
    const {id, url} = tab;
    chrome.scripting.executeScript(
      {
        target: {tabId: id, allFrames: true},
        files: ['./scripts/content.js']
      }
    )
    console.log(`Loading: ${url}`); 
  };

getVideoID = (url) => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        console.log("VideoID extracted...")
        return match[2];
    } else {
        console.log("No videoID was found...");
        return "Error";
    }
}

function handleSuccess(data) {
    if (data.items.length > 0) {
      console.log("output:", data.items[0]); // contentDetails.duration //snippet.title //snippet.channelTitle //snippet.description
    //   console.log("Video query output:", output);
    }
  }

// Popup HTML elements
let elmUrl = document.getElementById("url"); 
let elmCount = document.getElementById("count");
let elmRead = document.getElementById("read");
let elmVideo = document.getElementById("watch");

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    console.log("url=", url);
    elmUrl.innerText = `Url: ${url}`; // Update URL element
    console.log("tab=", tabs[0]);

    videoID = getVideoID(url);
    const key = "AIzaSyBmSKHmSYhdEB2usaHT0zFFzXosu4J2Y0k";

    let url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + key +"&part=snippet,contentDetails";
    fetch(url1).then(function(response) {
        console.log("response =", response);
        if (!response.ok) {
            throw new Error('Network response was not ok'); //hitting here:/
        }
        return response.json(); // Assuming the response is in JSON format
    }).then(handleSuccess)
    .catch(function(error) {
        console.error('Error:', error);
    });

    injectContentScript(tabs[0]); 
  });


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => { //Listener for content info
    if (message.words !== undefined && message.time !== undefined) {
        console.log('HEREEEE', message.words);
      wordCount = message.words;
      readingTime = message.time;
      console.log("Popup Received word count and reading time:", wordCount, readingTime);

      elmCount.innerText = (`Word Count: ${wordCount} words`);
      elmRead.innerText = (`Reading Time: ${readingTime} minutes`);
    }
    sendResponse();
});

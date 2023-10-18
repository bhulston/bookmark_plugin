import { getObsidian } from '../obsidian/o_utils.js';
import { injectContentScript, getVideoID, handleSuccess, checkURL, checkApiKey } from '../utils.js';

console.log("This is a popup!");
//Popup script handles queries that do not interact with the base DOM of the webpage.
//These are run on the ccurrent tab each time a popup window is opened

// const check = await fetch(url + "/", options);
const url = "https://127.0.0.1:27124/active/";
const key = "868beedb25e084c7daf918f437e39d237e4156d2d878c2ace37da31404d3b9ac";

const check = await getObsidian(url, key, 'text');
console.log("SCAREMAJFDSLJF", check);

//API WORKS! There seemed to be cert issues that were causing problems. so make sure it's added to keychain on mac (and windows equivalent?)




// Popup HTML elements
// let elmUrl = document.getElementById("url"); 
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
    console.log("tab=", tabs[0]);

    const type = checkURL(url);

    if (type == "youtube") {
        elmInfo3.innerText = "Watch Duration:"
        elmInfo4.innerText = "Channel Title:"

        //Parse for video information
        const videoID = getVideoID(url);
        const key = "AIzaSyBmSKHmSYhdEB2usaHT0zFFzXosu4J2Y0k";
        let url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + key +"&part=snippet,contentDetails";
        
        //Execute scripts and hit Google API
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
    //   wordCount = message.wordCount;
      const readingTime = message.readingTime;
      elmValue3.value = `${readingTime} minutes`;

      console.log("article info extracted");

    } if ( message.readSuccess = false ) {

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Act when content script reads relevant info
    if ( message.authorSuccess ) {
      console.log("author:", message.authorSuccess, message.authorID);
      elmValue4.value = message.authorID;
    }
    sendResponse();
});


// Get a reference to the button element by its ID
const runScriptButton = document.getElementById('runScriptButton');

// Add a click event listener to the button
runScriptButton.addEventListener('click', function () {
    // const openObsidianUri = 'obsidian://open?vault=';

    // const check = checkApiKey("test", "key");
    
    console.log(check);
    alert('Button Clicked! Your script can go here.', check);
});

//Folder structure
// Get references to the button and folder popup elements
const openFolderButton = document.getElementById('openFolderButton');
const folderPopup = document.getElementById('folderPopup');

// Function to open the folder popup
async function openFolderPopup() {
    console.log('function called')
    folderPopup.style.display = 'block';
};

// Function to close the folder popup
function closeFolderPopup() {
    folderPopup.style.display = 'none';
    console.log('folder popup closed')
};

// Add a click event listener to the button
openFolderButton.addEventListener('click', openFolderPopup);

// You can also add a close button or other logic to close the popup when needed
// For example, to close the popup when clicking outside of it:
document.addEventListener('click', (event) => {
    if (!folderPopup.contains(event.target) && event.target !== openFolderButton) {
        closeFolderPopup();
    }
});
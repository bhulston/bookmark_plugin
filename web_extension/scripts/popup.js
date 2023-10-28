import { postObsidian, getDir } from '../obsidian/o_utils.js';
import { write_doc } from '../obsidian/template.js';
import { injectContentScript, getVideoID, handleSuccess, checkURL, checkApiKey } from '../utils.js';
import { createFolderStructure } from './directory.js';



console.log("This is a popup!");
//Popup script handles queries that do not interact with the base DOM of the webpage.
//These are run on the ccurrent tab each time a popup window is opened

// const check = await fetch(url + "/", options);
const APIurl = "https://127.0.0.1:27124/vault/test.md";
const key = "868beedb25e084c7daf918f437e39d237e4156d2d878c2ace37da31404d3b9ac";
const root = 'https://127.0.0.1:27124/vault/';

const folderData = {
    //CHANGE this to put tester (and other root based files) as root files, instead of in 10 Personal which is where it goes now??
    "files": [
      "00 Meta/",
      "10 Personal/",
      "00 Meta/test",
      "tester",
      "10 Personal/IPhone Notes/",
      "10 Personal/Daily Life/",
      "10 Personal/Daily Life/YUHHH",
      "10 Personal/Hallo",
      "10 Personal/IPhone Notes/1",
      "10 Personal/IPhone Notes/12/",
      "10 Personal/IPhone Notes/12/Hey QT",
      "10 Personal/IPhone Notes/2",
      "10 Personal/IPhone Notes/12/Android",
    ]
  };
//Fix the createFolderStructure from directory.js to properly make the structure
const folderStructureContainer = document.getElementById('folder-structure');
const element = createFolderStructure(folderData, folderStructureContainer);
folderStructureContainer.innerHTML = element;

//Actual queries to get the real folderData is below

// const folderData = getDir(key);
// getDir(key, root).then((folderData) => {
//     console.log('Directory API response', folderData);
//     const folderStructureContainer = document.getElementById('folder-structure');
//     console.log('Directory test', folderStructureContainer);
//     createFolderStructure(folderData, folderStructureContainer);
// }).catch((error) => {
//     console.log(error)
// });


//API WORKS! There seemed to be cert issues that were causing problems. so make sure it's added to keychain on mac (and windows equivalent?)
//CHANGE this so that we can choose the specific bookmarks document we send to 
    // This way I can have one for guitar, one for this etc. Maybe it's a 
    //Reqs here are: 1. Send doc to a specific document appending if you like 2. Send to a bookmarks folder 3. Create the corresponding note if you want


// Popup HTML elements
// let elmUrl = document.getElementById("url"); 
let elmTitle = document.getElementById("title");
let elmInfo3 = document.getElementById("info3");
let elmInfo4 = document.getElementById("info4");

let elmDuration = document.getElementById("value3");
let elmVideo = document.getElementById("value4");

let url = "";

const sendObsidian = document.getElementById("sendButton");

sendObsidian.addEventListener('click', async function () {
    // const check = checkApiKey("test", "key");
    // Build our Obsidian Doc
    const doc = write_doc(elmTitle.value, elmDuration.value, url, "this is a cool article!!!", false, "PUT");
    const check = await postObsidian(APIurl, key, 'text', doc);
    console.log("SCAREMAJFDSLJF", check);

    console.log(check);
    alert('Button Clicked! Your script can go here.', check);
});

//CHANGE so that we make it do a post by default, and do a put when box is marked
    // So first we need to build a checkmark box for "create new notes doc"
        // if not checked we just append it to the bookmarks folder you choose


// Query GoogleAPI for Youtube video information and activate content script if not from youtube
    //runs on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //Set URL
    url = tabs[0].url;
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
            handleSuccess(data, elmTitle, elmDuration, elmVideo)
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
      elmDuration.value = `${readingTime} minutes`;

      console.log("article info extracted");

    } if ( message.readSuccess = false ) {

    //   wordCount = message.wordCount;
      const readingTime = message.readingTime;
      elmDuration.value = readingTime;

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
      elmVideo.value = message.authorID;
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
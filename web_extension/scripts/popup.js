import { postObsidian, getDir } from '../obsidian/o_utils.js';
import { write_doc } from '../obsidian/template.js';
import { injectContentScript, getVideoID, handleSuccess, checkURL, checkApiKey, handleApiResponse } from '../utils.js';
import { createFolderStructure, generateSearch } from './directory.js';

//Popup script handles queries that do not interact with the base DOM of the webpage.
//These are run on the ccurrent tab each time a popup window is opened

// Popup HTML elements //
let elmTitle = document.getElementById("title");
let elmInfo3 = document.getElementById("info3");
let elmInfo4 = document.getElementById("info4");
let newNoteTitle = document.getElementById("newNoteTitle");

let elmDuration = document.getElementById("value3");
let elmAuthor = document.getElementById("value4");

const sendObsidian = document.getElementById("sendButton");
const sendDaily = document.getElementById("dailyNote");
const refreshVault = document.getElementById("refreshVault");
const slider = document.getElementById('slider-container');
const slider2 = document.getElementById('slider-container2');

const mdTemplate = document.getElementById('MDtemplate');

// Search elements
const searchInput = document.getElementById("bookmarkValue");
const searchResults = document.getElementById("bookmarkResults");
const searchInput2 = document.getElementById("newNoteLoc");
const searchResults2 = document.getElementById("bookmarkResults2");

// Get references to the button and folder popup elements
const openFolderButton = document.getElementById('openFolderButton');
const folderPopup = document.getElementById('folderPopup');

let url = "";

//        Cache and Options Page Loading        //
let options = { };

// Asynchronously retrieve data from storage.sync, then cache it in options.
const initOptionsCache = async () => {
  try {
    const items = await chrome.storage.sync.get();
    // Copy the data retrieved from storage into options.
    Object.assign(options, items);
    // Load in relevant HTML elements based on 
    loadVault();
    console.log("Options cache loaded:", options);

    const custom = document.getElementById('customTemplate').checked;
    if (!custom) {
        mdTemplate.value = options.md;
    };
    if (!options.defaultLoc == '') {
        document.getElementById("bookmarkValue").value = options.defaultLoc;
    };

    const author = document.getElementById("author");
    if (options.author) {
        if (!document.getElementById("author").classList.contains('hidden')){
            author.classList.add('hidden');
        }
    } else {
        if (document.getElementById("author").classList.contains('hidden')){
            author.classList.remove('hidden');
        }
    };

    const time = document.getElementById("time");
    if (options.time) {
        if (!document.getElementById("time").classList.contains('hidden')){
            time.classList.add('hidden');
        }
    } else {
        if (document.getElementById("time").classList.contains('hidden')){
            time.classList.remove('hidden');
        }
    };
  } catch (e) {
    // Handle error that occurred during storage initialization.
    console.error('Error initializing options from storage:', e);
  }
};

// Initialize cache
initOptionsCache();

const loadVault = async () => {
    getDir(options.apiKey).then((folderData) => {
        generateSearch(folderData, searchResults, 'file');
        generateSearch(folderData, searchResults2, 'folder');

        const folderStructureContainer = document.getElementById('folder-structure');

        const element = createFolderStructure(folderData);
        folderStructureContainer.innerHTML = element;

    }).catch((error) => {
        console.log(error)
    });
};

function getProtocol() {
    if (options.customPort) {
        const protocol = options.port;
         return protocol;
    } else {
        const protocol = options.protocol
        return protocol;
    }
};

chrome.storage.onChanged.addListener((changes, namespace) => {
    // Update options on storage changes
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      options[key] = newValue;
      if (key == 'apiKey') {
        loadVault();
      }

    }
  });

//     Buttons       //

sendDaily.addEventListener('click', async function ()  {
    initOptionsCache();
    console.log("Send to Obsidian process started...");
    // Build our Obsidian Doc
    const custom = document.getElementById('customTemplate').checked;
    const create = document.getElementById("openNote");
    const docVars = {
        title: elmTitle.value,
        time: elmDuration.value,
        author: elmAuthor.value,
        url: `${url}`
        };
    const hideAuthor = document.getElementById('author').checked;
    const hideTime = document.getElementById('time').checked;

    if (hideAuthor) {
        delete docVars.author;
    }
    if (hideTime) {
        delete docVars.time;
    }

    let md = '';
    if (custom) {
        md = write_doc(mdTemplate.value, docVars);
    } else {
        md = write_doc(options.md, docVars);
    }

    const APIurl = getProtocol() + '/periodic/daily/';

    const yaml = write_doc(options.yaml, docVars);

    const newNotePath = document.getElementById("newNoteLoc").value;
    const optionURL = getProtocol() + '/vault/' + newNotePath + newNoteTitle.value + '.md';
    console.log("Sending to daily note");
    const check = await postObsidian(APIurl, options.apiKey, 'text', md, create.checked, optionURL, yaml);
    const status = document.getElementById("apiStatus");
    handleApiResponse(check, status);
});

sendObsidian.addEventListener('click', async function () {
    console.log("Send to Obsidian process started...");
    initOptionsCache();
    // Build our Obsidian Doc
    const custom = document.getElementById('customTemplate').checked;
    const create = document.getElementById("openNote");
    const docVars = {
        title: elmTitle.value,
        time: elmDuration.value,
        author: elmAuthor.value,
        url: `${url}`
        };
    const hideAuthor = document.getElementById('author').checked;
    const hideTime = document.getElementById('time').checked;

    if (hideAuthor) {
        delete docVars.author;
    }
    if (hideTime) {
        delete docVars.time;
    }
    let md = '';
    if (custom) {
        md = write_doc(mdTemplate.value, docVars);
    } else {
        md = write_doc(options.md, docVars);
    }
    
    const yaml = write_doc(options.yaml, docVars);

    const APIpath = document.getElementById("bookmarkValue").value;
    const APIurl = getProtocol() + '/vault/' + APIpath;
    
    const newNotePath = document.getElementById("newNoteLoc").value;
    const optionURL = getProtocol() + '/vault/' + newNotePath + newNoteTitle.value + '.md';
    const check = await postObsidian(APIurl, options.apiKey, 'text', md, create.checked, optionURL, yaml);

    const status = document.getElementById("apiStatus");
    handleApiResponse(check, status);
});

refreshVault.addEventListener('click', async function () {
    const status = document.getElementById("apiStatus");
    try {
        loadVault();
        handleApiResponse(true, status, 'refresh');
    } catch (e) {
        status.textContent = "An Error Occurred:(";
        setTimeout(() => status.textContent = "", 2000);
    };
});


// Query GoogleAPI for Youtube video information or activate content script if not from youtube //
    //runs on popup open
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    console.log("Running content script/youtube api");
    //Set URL
    initOptionsCache();

    url = tabs[0].url;
    console.log("url=", url);

    const type = checkURL(url);

    if (type == "youtube") {
        elmInfo3.innerText = "Watch Duration:"
        elmInfo4.innerText = "Channel Title:"

        //Parse for video information
        const videoID = getVideoID(url);
        const key = options.googleAPI;
        let url1 = "https://www.googleapis.com/youtube/v3/videos?id=" + videoID + "&key=" + key +"&part=snippet,contentDetails";
        
        //Execute scripts and hit Google API
        const data = fetch(url1).then(function(response) {
            if (!response.ok) {
                throw new Error('Network response was not ok'); //hitting here:/
            }
            return response.json(); // Assuming the response is in JSON format
        }).then(function(data){
            handleSuccess(data, elmTitle, elmDuration, elmAuthor, newNoteTitle)
        }).catch(function(error) {
            console.log('Google API Error:', error);
            // Google API failed, so let's manually get title. Getting the watch time requires too much work without the api
            injectContentScript(tabs[0]);
        });
    } else {
    // Need to use a content script to read DOM contained information (word count and reading time)
        injectContentScript(tabs[0]); 
    }
  });

//        Listeners for Content info     //
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Act when content script reads relevant info
    if ( message.readSuccess == true ) {
    //   wordCount = message.wordCount;
      const readingTime = message.readingTime;
      elmDuration.value = `${readingTime}`;


    } if ( message.readSuccess = false ) {

    //   wordCount = message.wordCount;
      const readingTime = message.readingTime;
      elmDuration.value = readingTime;

    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Act when content script reads relevant info
    if ( message.headSuccess == true ) {
      elmTitle.value = message.title;
      newNoteTitle.value = message.title;
    }
    sendResponse();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //Act when content script reads relevant info
    if ( message.authorSuccess ) {
      elmAuthor.value = message.authorID;
    }
    sendResponse();
});


//        Folder structure      //

// Function to open the folder popup
async function openFolderPopup() {
    folderPopup.style.display = 'block';
};

// Function to close the folder popup
function closeFolderPopup() {
    folderPopup.style.display = 'none';
};

function closeSearch() {
    if (searchResults.classList.contains('hidden')) {
        //do nothing
    } else {
        searchResults.classList.add('hidden');
    }
};

function closeSearch2() {
    if (searchResults2.classList.contains('hidden')) {
        //do nothing
    } else {
        searchResults2.classList.add('hidden');
    }
};

function displayNewNote() {
    const checked = document.getElementById('openNote');
    if (checked.checked) {
        newNoteContainer.classList.remove('hidden');
    } else {
        newNoteContainer.classList.add('hidden');
    }
};

function displayTemplates() {
    const checked = document.getElementById('customTemplate');
    const templateContainer = document.getElementById('templateContainer');
    if (checked.checked) {
        templateContainer.classList.remove('hidden');
    } else {
        templateContainer.classList.add('hidden');
    }
}

// Add a click event listener to the button
openFolderButton.addEventListener('click', openFolderPopup);
slider.addEventListener('click', function(event) {
    displayNewNote();
    newNoteTitle.value = elmTitle.value;
});
slider2.addEventListener('click', displayTemplates);

// Close the popup when clicking outside of it:
document.addEventListener('click', (event) => {
    if (!folderPopup.contains(event.target) && event.target !== openFolderButton) {
        closeFolderPopup();
    }
    if (!searchResults.contains(event.target)) {
        closeSearch();
    }
    if (!searchResults2.contains(event.target)) {
        closeSearch2();
    }
});

// Listener to navigate folder structure and add to bookmark location
document.addEventListener("click", function(event) {
    // Check if the clicked element is a folder
    if (searchResults2.contains(event.target)) {
        const newNoteLoc = document.getElementById('newNoteLoc');
        newNoteLoc.value = event.target.getAttribute('data-fullPath');
        closeSearch2();
    } else {
        if (event.target.classList.contains('folder')) {
            const folder = event.target.closest('.folder');
            const childDts = folder.querySelectorAll(':scope > dl > dt');
            
            if (folder.querySelector('dt').classList.contains('hidden')) {
                childDts.forEach((childDt) => {
                    childDt.classList.remove('hidden');
                  });
                folder.classList.add('collapse-icon');
                folder.classList.remove('expand-icon');
            } else {
                childDts.forEach((childDt) => {
                    childDt.classList.add('hidden');
                  });
                folder.classList.add('expand-icon');
                folder.classList.remove('collapse-icon');
            }
        }
    }
    

    // Check if the clicked element is a file
    if (event.target.classList.contains('file')) {
        // Handle file click
        const saveFile = document.getElementById('bookmarkValue');
        saveFile.value = event.target.getAttribute('data-fullPath');
        closeFolderPopup();
        closeSearch();
    }
});

// Alternatively, search for bookmark location 

// listen for user events
searchInput.addEventListener("keyup", (event) => {
    //Visualize results
    searchResults.classList.remove('hidden');

    // store name elements in array-like object
    const pathsFromDOM = document.querySelectorAll("#bookmarkResults .path");

    // get user search input converted to lowercase
    const { value } = event.target;
    const searchQuery = value.toLowerCase();
    
    for (const pathElement of pathsFromDOM) {
        // store name text and convert to lowercase
        let path = pathElement.textContent.toLowerCase();
        const splitPath = path.split("/");
        const file = splitPath.pop(); 
        
        // compare current name to search input
        if (file.includes(searchQuery)) {
            // found name matching search, display it
            pathElement.style.display = "block";
        } else {
            // no match, don't display name
            pathElement.style.display = "none";
        }
    }
});

searchInput2.addEventListener("keyup", (event) => {
    //Visualize results
    searchResults2.classList.remove('hidden');

    // store name elements in array-like object
    const pathsFromDOM = document.querySelectorAll("#bookmarkResults2 .folder");

    // get user search input converted to lowercase
    const { value } = event.target;
    const searchQuery = value.toLowerCase();
    
    for (const pathElement of pathsFromDOM) {
        // store name text and convert to lowercase
        let path = pathElement.textContent.toLowerCase();
        const splitPath = path.split("/");
        splitPath.pop();
        const file = splitPath.pop(); 
        
        // compare current name to search input
        if (file.includes(searchQuery)) {
            // found name matching search, display it
            pathElement.style.display = "block";
        } else {
            // no match, don't display name
            pathElement.style.display = "none";
        }
    }
});
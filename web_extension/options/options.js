import { checkApiKey } from "../utils.js";
import { getDir } from "../obsidian/o_utils.js";
import { generateSearch } from "../scripts/directory.js";

// First, we setup the cache
const options = { count: 0 }; // Renamed to options for clarity

// Asynchronously retrieve data from storage.sync, then cache it in options.
const initOptionsCache = async () => {
  try {
    const items = await chrome.storage.sync.get();
    // Copy the data retrieved from storage into options.
    Object.assign(options, items);
  } catch (e) {
    // Handle error that occurred during storage initialization.
    console.error('Error initializing options from storage:', e);
  }
};

// Listen for when the extension's icon is clicked.
chrome.action.onClicked.addListener((tab) => {
  // Increment the cache count and update the last tab ID in options.
  options.count++;
  options.lastTabId = tab.id;

  // Save the updated options back to storage.
  chrome.storage.sync.set(options);
});

// Saves options to browser.storage
async function saveSettings(event) {
    event?.preventDefault();
    selectFile();
    setStatus();
    console.log("Settings saved!");
    //Set cache to new values
    options.apiKey = document.getElementById("apiKey").value;
    options.googleAPI = document.getElementById("googleAPI").value; // YouTube Data API v3
    // options.vault = document.getElementById("vault").value;
    options.md = document.getElementById("MDtemplate").value;
    options.yaml = document.getElementById("YAMLtemplate").value;

    options.protocol = document.getElementById("protocol").value ;
    options.customPort = Boolean(document.getElementById("customPort").checked);
    options.port = Number(document.getElementById("port").value);
    options.defaultLoc = document.getElementById("defaultLoc").value

    options.author = Boolean(document.getElementById("author").checked);
    options.time = Boolean(document.getElementById("time").checked);

    chrome.storage.sync.set(options);

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.textContent = "Options saved.";
    setTimeout(() => status.textContent = "", 750);
    console.log("Cache values:", options)
}

// Restores settings on page loadup
async function restoreSettings() {
    initOptionsCache().then(() => {
        // Fill data fields using the cached options
        for (const [key, value] of Object.entries(options)) {
            if (key == 'author' || key == 'time' || key == 'customPort') {
                document.querySelector('#' + key).checked = value;
            } else if (document.querySelector('#' + key)) {
                document.querySelector('#' + key).value = value;
            }
            // if (key == 'vault') {
            //     document.querySelector('#openVault').href = openObsidianUri + encodeURIComponent(value);
            // }
            if (key == 'apiKey') {
                try {
                    selectFile();
                } catch (e) {
                    console.log('Obsidian APIKey not saved/valid', e);
                }
            }
            else if (key == 'yaml') {
                document.getElementById('YAMLtemplate').value = options.yaml;
            }
            else if (key == 'md') {
                document.getElementById('MDtemplate').value = options.md;
            }
        }
    });
};

// Connection check
async function setStatus() {
    const apiKey = document.getElementById('apiKey').value;
    const url = document.getElementById('protocol').value;
    const infoElem = document.getElementById('apiKeyCheck');
    infoElem.innerText = await checkApiKey(url, apiKey);
};

function selectFile() {
    console.log("Loading Obsidian Files");
    const search = document.getElementById('defaultLoc');
    const searchResults = document.getElementById('searchResults');
    const url = document.getElementById('protocol').value;

    const apiKey = options.apiKey;
    if (checkApiKey(url, apiKey)) {
        getDir(apiKey).then((folderData) => {
            generateSearch(folderData, searchResults, "file");
            console.log('Directory API response', folderData);
        }).catch((error) => {
            console.log(error)
        });
    
        search.addEventListener("keyup", (event) => {
            //Visualize results
            searchResults.classList.remove('hidden');
        
            // store name elements in array-like object
            const pathsFromDOM = document.getElementsByClassName("path");
            console.log(pathsFromDOM);
        
            // get user search input converted to lowercase
            const { value } = event.target;
            console.log('Search is', value);
            const searchQuery = value.toLowerCase();
            
            for (const pathElement of pathsFromDOM) {
                // store name text and convert to lowercase
                let path = pathElement.textContent.toLowerCase();
                const splitPath = path.split("/");
                const file = splitPath.pop(); 
                
                // compare current name to search input
                if (file.includes(searchQuery)) {
                    // found name matching search, display it
                    console.log('DISPLAYING!', file);
                    pathElement.style.display = "block";
                    console.log(pathElement);
                } else {
                    // no match, don't display name
                    console.log('BLOCKED');
                    pathElement.style.display = "none";
                }
            }
        });
    } else {
        //Try again later
    }
};

function closeSearch() {
    if (searchResults.classList.contains('hidden')) {
        //do nothing
    } else {
        searchResults.classList.add('hidden');
    }
};


document.addEventListener("DOMContentLoaded", () => {
    const init = () => {
        restoreSettings();
        selectFile();
        const portElem = document.getElementById('port-container');
        chrome.storage.sync.get({ customPort: false }).then((data) => {
            if (data.customPort) portElem.classList.remove('hidden');
            else portElem.classList.add('hidden');
        });
        document.getElementById('customPort').addEventListener('change', () => {
            portElem.classList.toggle('hidden');
        });
        document.getElementById("settings").addEventListener("submit", saveSettings);
        document.getElementById('apiKey').addEventListener('change', setStatus);
        document.getElementById('protocol').addEventListener('change', setStatus);
    }
    setTimeout(init, 500);
});

document.addEventListener('click', (event) => {
    //Click events
    const searchResults = document.getElementById('searchResults');
    const statusButton = document.getElementById('statusButton');

    if (statusButton.contains(event.target)) {
        setStatus();
    }
    
    if (!searchResults.contains(event.target)) {
        closeSearch()
    }

    // Check if the clicked element is a file
    if (event.target.classList.contains('file')) {
        // Handle file click
        console.log("file clicked", event.target);

        //Set visual elements
        const defaultLoc = document.getElementById('defaultLoc');
        defaultLoc.value = event.target.getAttribute('data-fullPath');
        
        //Save to cache
        options.defaultLoc = event.target.getAttribute('data-fullPath');
        closeSearch();
    }

    
    
});



function createFolderStructure(data, parentElement) {
    // Sort the files
    data.files.sort((a, b) => {
        // Split the strings into arrays to compare individual parts
        const partsA = a.split('/');
        const partsB = b.split('/');
      
        // Compare the parts one by one
        for (let i = 0; i < Math.min(partsA.length, partsB.length); i++) {
          if (partsA[i] !== partsB[i]) {
            return partsA[i].localeCompare(partsB[i]);
          }
        }
      
        // If one path is a prefix of the other, the shorter one comes first
        return partsA.length - partsB.length;
    });

    // Take out any root files (that are not in another folder)
    let rootFiles = [];
    let otherFiles = [];

    otherFiles = data.files.filter((path) => {
        if (path.includes('/')) {
            return true;
        } else {
            rootFiles.push(path);
            return false;
        }
    });

    data.files = otherFiles;

// Now, filesWithoutSlash contains the files that have no '/' in their names
// and data.files contains the files that do have a '/'.


    //Get subfolder and file data for each root file
    const newFolderData = buildSubFolders(data);
    let finalElement = '';

        for (const rootFolder in newFolderData) {
            // For each root file
            if (newFolderData.hasOwnProperty(rootFolder)) {
                // Access the current root folder
                console.log("Root Folder:", rootFolder);
            
                // Access the list of subfolders and files for the current root folder
                const contents = newFolderData[rootFolder];
            
                const element = buildFromRoot(rootFolder, contents);
                //complete element is then appended to the final element
                
                finalElement += element + '\n';
              }
        };
     
      const rootFileHTML = buildRootFiles(rootFiles);
      finalElement += rootFileHTML;

    return finalElement;
    // Now we return the element to be added to our html later
    
};

function buildRootFiles(data) {
    let html = ""
    data.forEach(file => {
        html += `<dl>\n<dt class="file" data-fullpath="${file}">${file}\n</dt>\n</dl>\n`
    })
    return html;
}

function buildSubFolders(data) {
    // Initialize an empty object to store the root folders and their contents
    const newFolderData = {};

    // Initialize a variable to keep track of the current root folder
    let currentRoot = null;

    // Iterate through the files and categorize them
    data.files.forEach(file => {
    if (file.endsWith('/') && file.split('/').length === 2) {
        // If it's a root folder
        currentRoot = file;
        newFolderData[currentRoot] = [];
    } else {
        // If it's a subfolder or file, add it to the current root
        if (currentRoot) {
        newFolderData[currentRoot].push(file);
        }
    }
    });

    // Now newFolderData contains the desired JSON structure
    console.log(newFolderData);
    return newFolderData;
};

function buildFromRoot(rootFolder, contents) {
    // Basically this takes only a single root's files and processes them as necessary and returns the final element container to be put in
    const folderMap = new Map();
  
    contents.forEach((path) => {
    // Remove each root from the path when being added in
      let parts = path.replace(rootFolder, "").split("/");
      let currentMap = folderMap;
  
      parts.forEach((part) => {
        if (!currentMap.has(part)) {
          currentMap.set(part, new Map());
        }
        currentMap = currentMap.get(part);
      });
      currentMap.fullPath = path;
    });
    return `<dl>\n<dt class="folder expand-icon">${rootFolder}\n  <dl>\n${generateHtml(folderMap, 2)}  </dl>\n</dt>\n</dl>`;
  };

function generateHtml(map, level = 0) {
    // Recursive function to iteratively write out the html and incorporate levels based on if something is part of a larger folder
    let indent = " ".repeat(level * 2);
    let html = "";

    for (const [key, value] of map.entries()) {
        let fullPath = value.fullPath;
        if (value.size === 0) {
            html += `${indent}<dt class="file hidden" data-fullpath="${fullPath}">${key}</dt>\n`; 
        } else {
            html += `${indent}<dt class="folder expand-icon hidden" data-fullpath="${fullPath}">${key}/\n`;
            html += `${indent}  <dl>\n`;
            html += generateHtml(value, level + 2);
            html += `${indent}  </dl>\n`;
            html += `${indent}</dt>\n`;
        }
    };

    return html;
};


// Code to get just the path end nodes, without any folders
function generateSearch(data, parentElement, option) {
    console.log("generateSearch function called");
    if (option == "file") {
        data.files.forEach((path) => {
            if (path.endsWith('.md')) {
                // Check if element already exists
                if (!elementExistsWithText(parentElement, path)) {
                    const listItem = document.createElement("li");

                    // Add classes
                    listItem.classList.add("file", "path");

                    // Add data attribute
                    listItem.setAttribute("data-fullpath", path);

                    // Add text
                    listItem.textContent = path;

                    // Append to results element
                    parentElement.appendChild(listItem);
                }
            }
        });
    } else {
        data.files.forEach((path) => {
            if (!path.endsWith('.md')) {
                // Check if element already exists
                if (!elementExistsWithText(parentElement, path)) {
                    const listItem = document.createElement("li");

                    // Add classes
                    listItem.classList.add("folder", "path");

                    // Add data attribute
                    listItem.setAttribute("data-fullpath", path);

                    // Add text
                    listItem.textContent = path;

                    // Append to results element
                    parentElement.appendChild(listItem);
                }
            }
        });
    }

    // Helper function to check if an element with the same textContent already exists
    function elementExistsWithText(parent, text) {
        const items = parent.getElementsByTagName("li");
        for (let i = 0; i < items.length; i++) {
            if (items[i].textContent === text) {
                return true;
            }
        }
        return false;
    }
}

export { createFolderStructure, generateSearch };

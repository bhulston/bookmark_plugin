function createFolderStructure(data, parentElement) {
    // Sort
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
      
    console.log("Here is the files sorted:, ", data.files);

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
     
      console.log(finalElement);
      return finalElement;
    // Now we return the element to be added to our html later
    
};

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
    });
    return `<dl>\n<dt>${rootFolder}\n  <dl>\n${generateHtml(folderMap, 2)}  </dl>\n</dt>\n</dl>`;
  };

function generateHtml(map, level = 0) {
    // Recursive function to iteratively write out the html and incorporate levels based on if something is part of a larger folder
    let indent = " ".repeat(level * 2);
    let html = "";

    for (const [key, value] of map.entries()) {
      if (value.size === 0) {
        html += `${indent}<dt>${key}</dt>\n`;
      } else {
        html += `${indent}<dt>${key}/\n`;
        html += `${indent}  <dl>\n`;
        html += generateHtml(value, level + 2);
        html += `${indent}  </dl>\n`;
        html += `${indent}</dt>\n`;
      }
    };

    return html;
};

export { createFolderStructure };

// function createFolderStructure(data, parentElement) {
    
//     const processedFolders = new Set();
//     data.files.forEach(item => {
//         const parts = item.split('/');
//         const root = parts[0];
//         const end = parts[parts.length - 1];
//         const isFolder = item.charAt(item.length - 1) === '/';
//         let file;

//         if (end === "") {
//             file = parts[parts.length - 2];
//         } else {
//             file = end;
//         }

//         if (file !== "") {  // Check if file is empty
//             const li = document.createElement('li');
//             if (isFolder) {
//                 if (!processedFolders.has(root)) {
//                     processedFolders.add(root);

//                     const folderName = document.createElement('span');
//                     folderName.classList.add('folder', 'expand-icon');
//                     folderName.textContent = file;
//                     folderName.addEventListener('click', () => {
//                         const childUl = li.querySelector('ul');
//                         if (childUl) {
//                             if (childUl.style.display === "none") {
//                                 childUl.style.display = "block";
//                             } else {
//                                 childUl.style.display = "none";
//                             }
//                         }
//                         folderName.classList.toggle('collapse-icon');
//                     });
//                     li.appendChild(folderName);

//                     const subFolderData = {
//                         files: data.files.filter(subItem => subItem !== item && subItem.startsWith(root + '/'))
//                     };
//                     console.log("Sub folder data looks like", subFolderData);

//                     if (subFolderData.files.length > 0) {
//                         createFolderStructure(subFolderData, li);
//                     }
//                 }
                
//             } else {
//                 if (!processedFolders.has(root)) {
//                     const fileName = document.createElement('span');
//                     fileName.classList.add('file');
//                     fileName.textContent = file;
//                     li.appendChild(fileName);
//                 }
//             }
//             ul.appendChild(li); // Append only if file is not empty
//         }
//     });

//     if (ul.childNodes.length > 0) {  // Check if ul has any child nodes
//         parentElement.appendChild(ul);
//     }
// };


// // const folderStructureContainer = document.getElementById('folder-structure');
// // createFolderStructure(folderData, folderStructureContainer);


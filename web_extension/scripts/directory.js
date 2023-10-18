const folderData = {
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
      "10 Personal/IPhone Notes/2",
      "10 Personal/IPhone Notes/12/Android",
    ]
  };

  function createFolderStructure(data, parentElement) {
    const ul = document.createElement('ul');
    const processedFolders = new Set(); // Keep track of processed folders

    data.files.forEach(item => {
        const li = document.createElement('li');
        const parts = item.split('/');
        const root = parts[0];
        const end = parts[parts.length - 1];
        const isFolder = item.charAt(item.length - 1) === '/';
        let file;
        const isSubFolder = end === "";
            if (isSubFolder) {
                file = parts[parts.length - 2];
            } else {
                file = end;
            }

        console.log(`Processing: ${item}, isFolder: ${isFolder}`);

        if (isFolder && file != "") {
            // Check if the folder has already been processed
            if (!processedFolders.has(root)) {
                processedFolders.add(root); // Mark the folder as processed

                const folderName = document.createElement('span');
                folderName.classList.add('folder', 'expand-icon');
                folderName.textContent = file;
                folderName.addEventListener('click', () => {
                    li.querySelector('ul').classList.toggle('hidden');
                    folderName.classList.toggle('collapse-icon');
                });
                li.appendChild(folderName);

                const subFolderData = {
                    files: data.files.filter(subItem => subItem !== item && subItem.startsWith(root + '/'))
                };
                //Issue HEREERERE - Folders with many subfolders are all getting shoved into the first one listed

                console.log(`SubFolderData.files: ${subFolderData.files}`);

                // Check if there are sub-items to process
                if (subFolderData.files.length > 0) {
                    createFolderStructure(subFolderData, li);
                }
            }
        } else {
            if (processedFolders.has(root)) {
                return
            } else if (file != '') {
                console.log("ELSE WAS HIT");
                const fileName = document.createElement('span');
                fileName.classList.add('file');
                fileName.textContent = file;
                li.appendChild(fileName);
            }
        }
        if (file != '') {
            ul.appendChild(li);
        }
        
    });
    parentElement.appendChild(ul);
    
    
};

const folderStructureContainer = document.getElementById('folder-structure');
createFolderStructure(folderData, folderStructureContainer);
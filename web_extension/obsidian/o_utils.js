// async function 


async function getObsidian(url, key, accept) {
    /*
    Where Method = GET, and returns data from Obsidian as a response

    ## Parameters ##
        url: The full obsidian API url we are calling
        key: User's API Key for obsidian
        accept: What media type that the API call should accept or look for
    */

    let media = 'text/markdown';
    if (accept != 'text') {
        media = 'application/json';
    };

    try { 
        const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': media,
          'Authorization': 'Bearer ' + key
        }
      });
      console.log("API Check", response);
      return response;
    } catch (e) {
        console.log('ERROR', e);
        return;
    };
};

async function postObsidian(url, key, accept, body, option, optionURL) {
    // first check if it exists, if it does, we append with post, otherwise we do a put
    const get_response = getObsidian(url, key, accept);
    console.log('HORNY', get_response);
    /*
    Where Method = PUT, and a file in Obsidian is to be created or modified in some way

    ## Parameters ##
        url: The url we are using, this will be built in the popup script based on user preferences. This should be the inbox for the bookmark. (As an option, because we will allow multiple inboxes if one prefers)
        key: This is the Local Obsidian REST API Key connected to a certain vault
        accept: This should basically not change, but just determines what we accept
        option: This will indicate whether or not we want to create a corresponding file
            optionURL: If option is true, this url (also built in popup) will choose where the corresponding file will be built.

    */
   let media = 'text/markdown';
   if (accept != 'text') {
       media = 'application/json';
   };

   // if file does exist, append
   if (get_response) {
    const method = 'POST';
        // Appends starting on a new line
   } else {
    const method = 'PUT';
   }

   const method = 'PUT';

   // if file doesn't exist
   try { 
    const requestData = body;
    const response = await fetch(url, {
    method: method,
    headers: {
        'accept': media,
        'Authorization': 'Bearer ' + key},
    body: requestData
    });
    
    console.log("API Check", response);
    return response;
  } catch (e) {
    console.log('ERROR', e);
    return;
  };
};



// async function collectDir(data, folders, key, url) {
//     for (const item of data.files) {
//         // const parts = item.split('/');
//         // const root = parts[0];
//         let uri = url + item;
//         // const end = parts[parts.length - 1];
//         const isFolder = item.charAt(item.length - 1) === '/';
//         let file;

//         // if (end === "") {
//         //     file = parts[parts.length - 2];
//         // } else {
//         //     file = end;
//         // }

//         folders.files.push(data.files);

//         if (isFolder) {
//             try {
//                 console.log("Querying files contained in", uri);
//                 const response = await fetch(uri, {
//                     method: 'GET',
//                     headers: {
//                         'accept': 'text/markdown',
//                         'Authorization': 'Bearer ' + key
//                     }
//                 });
//                 const responseData = await response.json();
//                 await collectDir(responseData, folders, key, uri);
//             } catch (e) {
//                 console.log('ERROR', e);
//             }
//         }
//     }
//     return folders;
// };

// async function getDir(key, url) {
//     const root = 'https://127.0.0.1:27124/vault/';
//     let folders = { files: [] };

//     try { 
//         const response = await fetch(root, {
//             method: 'GET',
//             headers: {
//                 'accept': 'json',
//                 'Authorization': 'Bearer ' + key
//             }
//         });
        
//         console.log("API Check in getDir", response);
//         const responseData = await response.json();
//         folders = await collectDir(responseData, folders, key, url);
//     } catch (e) {
//         console.log('ERROR', e);
//         alert('Folder Retrieval Failed, please update your API Key or your vault information');
//         return;
//     }

//     return folders;
// };
async function collectDir(data, folders, key, url) {
    for (const item of data.files) {
        const isFolder = item.charAt(item.length - 1) === '/';
        const uri = url + item; // Updating the URI based on the parent folder
        
        const isMD = item.slice(-2) === 'md';
        
        if (isFolder) {
            folders.files.push(uri); // push folder names
            try {
                console.log("Querying files contained in", uri);
                const response = await fetch(uri, {
                    method: 'GET',
                    headers: {
                        'accept': 'json',
                        'Authorization': 'Bearer ' + key
                    }
                });
                const responseData = await response.json();
                await collectDir(responseData, folders, key, uri);
            } catch (e) {
                console.log('ERROR', e);
            }
        } else if (isMD) {
            folders.files.push(uri); // push file names
        }
    }
    return folders;
};

async function getDir(key, url) {
    const root = url || 'https://127.0.0.1:27124/vault/'; // Assuming url is optional
    let folders = { files: [] };

    try { 
        const response = await fetch(root, {
            method: 'GET',
            headers: {
                'accept': 'json',
                'Authorization': 'Bearer ' + key
            }
        });
        
        console.log("API Check in getDir", response);
        const responseData = await response.json();
        folders = await collectDir(responseData, folders, key, root);
    } catch (e) {
        console.log('ERROR', e);
        alert('Folder Retrieval Failed, please update your API Key or your vault information');
        return;
    }

    return folders;
};







export {postObsidian, getDir};



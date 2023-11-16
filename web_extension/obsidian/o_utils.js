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
      return response;
    } catch (e) {
        console.log('ERROR', e);
        return;
    };
};

async function postObsidian(url, key, accept, md, option, optionURL, yaml) {
    // first check if it exists, if it does, we append with post, or we do a put
    const get_response = getObsidian(url, key, accept);
    /*
    Every bookmark send will always have a post and a put
        The post is to append to the bookmarks tab
        The put creates a corresponding file if requested

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

   // if post file exists, post to the bookmark file
   let response1 = false;
   if (get_response) {
    const method = 'POST';
        try { 
            const requestData = md;
            const response = await fetch(url, {
            method: method,
            headers: {
                'accept': media,
                'Authorization': 'Bearer ' + key},
            body: requestData
            });
            
            response1 = true;
        } catch (e) {
            console.log('ERROR', e);
            response1 = false;
        };
   } else {
    response1 = false;
   }

   // if option is true, also create a new file that corresponds to the note in the requested folder
   let response2 = false;
   if (option) {
    const method = 'PUT';
        try {
            const requestData = yaml;
            const response = await fetch(optionURL, {
            method: method,
            headers: {
                'accept': media,
                'Authorization': 'Bearer ' + key},
            body: requestData
            });
            
            response2 = true;
        } catch (e) {
            console.log('ERROR', e);
            response2 = false;
        }
    return (response1, response2)
   } else {
    return response1;
   }
};


async function collectDir(data, folders, key, url) {
    for (const item of data.files) {
        const isFolder = item.charAt(item.length - 1) === '/';
        const uri = url + item; // Updating the URI based on the parent folder
        
        const isMD = item.slice(-2) === 'md';
        
        if (isFolder) {
            folders.files.push(cleanURI(uri)); // push folder names
            try {
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
            folders.files.push(cleanURI(uri)); // push file names
        }
    }
    return folders;
};

function cleanURI(uri) {
    const root = 'https://127.0.0.1:27124/vault/';
    return uri.replace(new RegExp(`^${root}`), '');

}

async function getDir(key) {
    const root = 'https://127.0.0.1:27124/vault/'; // Assuming url is optional CHANGE THIS TO GET 
    let folders = { files: [] };

    try { 
        const response = await fetch(root, {
            method: 'GET',
            headers: {
                'accept': 'json',
                'Authorization': 'Bearer ' + key
            }
        });
        
        const responseData = await response.json();
        folders = await collectDir(responseData, folders, key, root);
    } catch (e) {
        console.log('ERROR', e);
        return;
    }

    return folders;
};


export {postObsidian, getDir};
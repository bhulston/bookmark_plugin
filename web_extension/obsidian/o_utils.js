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

async function putObsidian() {
    /*
    Where Method = PUT, and a file in Obsidian is to be created or modified in some way

    ## Parameters ##

    */
   let media = 'text/markdown';
   if (accept != 'text') {
       media = 'application/json';
   };

   try { 
    const response = await fetch(url, {
    method: 'PUT',
    headers: {
        'accept': media,
        'Authorization': 'Bearer ' + key}
    });
    console.log("API Check", response);
    return response;
  } catch (e) {
    console.log('ERROR', e);
    return;
  };
};

async function postObsidian() {
    ```
    Where Method = POST, and usually executes some sort of command (like opening a file or executing a search query)

    ## Parameters ##

    ```

}








export {getObsidian};



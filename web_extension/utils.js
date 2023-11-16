function ISO8601DurationToSeconds (duration) {
	let seconds = duration.match(/(\d*)S/)
	seconds = parseInt(seconds ? (parseInt(seconds[1], 10) ? seconds[1] : 0) : 0, 10)
  seconds = cleanDuration(seconds);

	let minutes = duration.match(/(\d*)M/)
	minutes = parseInt(minutes ? (parseInt(minutes[1], 10) ? minutes[1] : 0) : 0, 10)
  

	let hours = duration.match(/(\d*)H/)
	hours = parseInt(hours ? (parseInt(hours[1], 10) ? hours[1] : 0) : 0, 10)

    if (hours > 0) {
      minutes = cleanDuration(minutes);
        return `${hours}:${minutes}:${seconds}`
    } else {
        return `${minutes}:${seconds}`
    }
	     
};

function cleanDuration (int) {
  let str = int.toString();
  if (str.length === 1) {
    return '0' + str;
  } else {
    return str;
  }
};

const injectContentScript = (tab) => {
  const { id, url } = tab;
  chrome.scripting.executeScript({
      target: { tabId: id, allFrames: false },
      files: ['./scripts/content.js']
  });
  console.log(`Loading: ${url}`);
};

const getVideoID = (url) => {
    var regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[2].length == 11) {
        console.log("VideoID extracted...")
        return match[2];
    } else {
        console.log("No videoID was found...");
        return "Error";
    }
};

const handleSuccess = (data, elmTitle, elmDuration, elmVideo, newNoteTitle) => {
    if (data.items.length > 0) {
      console.log("output:", data.items[0]); // contentDetails.duration //snippet.title //snippet.channelTitle //snippet.description
    //   console.log("Video query output:", output);
      const duration = data.items[0].contentDetails.duration; //Must be ISO parsed
      const title = data.items[0].snippet.title;
      const channel = data.items[0].snippet.channelTitle;

      console.log(duration);
      elmTitle.value = title;
      newNoteTitle.value = title;
      elmVideo.value = channel;
      elmDuration.value = ISO8601DurationToSeconds(duration);
    }
  };

const checkURL = (url) => {
    const pattern = /youtube/i;

    if (pattern.test(url)) {
        console.log("The URL is from YouTube.com");
        return "youtube";
        
    } else {
        console.log("The URL is not from YouTube.com");
        return "article";
        
    }
};

function handleApiResponse(response, element, option) {
  let firstResult, secondResult;
  var status = element;

  // Check if the response is a tuple (array)
  if (Array.isArray(response)) {
    [firstResult, secondResult] = response;
  } else {
    // It's a single boolean value
    firstResult = response;
    // Default second result to null or some default value
    secondResult = null;
  }

  // Now you can handle the scenarios based on the values of firstResult and secondResult
  // Scenario: refresh
  if (option == 'refresh') { 
    console.log('Refreshing Vault');
    status.textContent = "⟳ Vault Refreshed";
    setTimeout(() => status.textContent = "", 1500);
  }
  // Scenario: No Note
  else if (option == '') {
    status.textContent = "❗No Bookmark Location specified";
    setTimeout(() => status.textContent = "", 3000);
  }
  else if (option == '' && secondResult === true) {
    status.textContent = "✅New Note Saved!";
    setTimeout(() => status.textContent = "", 3000);
  }
  // Scenario: both true
  else if (firstResult && secondResult === true) {
    console.log("✅Bookmark and New Note Saved!");
    status.textContent = "✅Bookmark and New Note Saved!";
    setTimeout(() => status.textContent = "", 3000);
    // Perform the action for when both conditions are true
  }
  // Scenario: both false
  else if (firstResult === false && secondResult === false) {
    console.log("❗Bookmark and Note Failed");
    status.textContent = "❗Bookmark and Note Failed";
    setTimeout(() => status.textContent = "", 3000);
    // Perform the action for when both conditions are false
  }
  // Scenario: first is true, second is false
  else if (firstResult && secondResult === false) {
    console.log("❗Bookmark made, but New Note Failed");
    status.textContent = "❗Bookmark made, but New Note Failed";
    setTimeout(() => status.textContent = "", 3000);
  }
  // Scenario: first is false, second is true
  else if (firstResult === false && secondResult) {
    console.log("❗Bookmark Failed, but New Note Created");
    status.textContent = "❗Bookmark Failed, but New Note Created"
    setTimeout(() => status.textContent = "", 3000);
  }
  // Scenario: single true
  else if (firstResult && secondResult === null) {
    console.log("✅Bookmark Saved!");
    status.textContent = "✅Bookmark Saved!";
    setTimeout(() => status.textContent = "", 3000);
  }
  // Scenario: single false
  else if (firstResult === false && secondResult === null) {
    console.log("❗Bookmark Failed");
    status.textContent = "❗Bookmark Failed";
    setTimeout(() => status.textContent = "", 3000);
  }
};

async function checkApiKey(url, apiKey) {
    console.log(url, apiKey);
    // API GET function
    const options = {
      method: 'GET',
      headers: {
        Authorization: "Bearer " + apiKey
      }
    };
  
    let statusText = '';
    let data = {};
    let action = '';
  
    try {
      const resp = await fetch(url + "/", options);
      data = await resp.json();
      console.log('fetched data', data);
  
      if (data.status == 'OK' && data.authenticated) {
        // Check response
        statusText = "✅ Succcessfully connected to Obsidian";
        data = { status: 'search', statusText };
        action = 'search';
      }
      else {
        // Response failed, then...
        statusText = '🔑 Could reach Obsidian REST Api - API-Key is not valid. Please check and copy the key from Obsidian REST Api Plugin Settings';
        data = { status: 'noauth', results: 'x', statusText };
        action = 'noauth';
      };
    }
    catch (e) {
      console.log('error reason', e);
      statusText = '❗ Make sure Obsidian is running and set your Protocol / Port settings to connect to your Obsidian REST Api!';
      data = { status: 'offline', results: 'off', statusText };
      action = 'offline';
    }
  
  
    try {
    //   browser.storage.sync.set(data);
      console.log('stored', data);
    //   browser.runtime.sendMessage({ action: 'badge', data });
      console.log('sent', action, data)
  
    } catch (e) {
      console.log('runtimeMsgError', e);
    }
    // const event = new CustomEvent(action, data);
    // window.dispatchEvent(event);
    console.log('dispatched', action, data);
    console.log(statusText);
    return statusText;
  };

export { ISO8601DurationToSeconds, injectContentScript, getVideoID, handleSuccess, checkURL, checkApiKey, handleApiResponse } ;
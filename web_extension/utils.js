function ISO8601DurationToSeconds (duration) {
	let seconds = duration.match(/(\d*)S/)
	seconds = parseInt(seconds ? (parseInt(seconds[1], 10) ? seconds[1] : 0) : 0, 10)

	let minutes = duration.match(/(\d*)M/)
	minutes = parseInt(minutes ? (parseInt(minutes[1], 10) ? minutes[1] : 0) : 0, 10)

	let hours = duration.match(/(\d*)H/)
	hours = parseInt(hours ? (parseInt(hours[1], 10) ? hours[1] : 0) : 0, 10)

    if (hours > 0) {
        return `${hours}:${minutes}:${seconds}`
    } else {
        return `${minutes}:${seconds}`
    }
	     
};

const injectContentScript = (tab) => {
const { id, url } = tab;
chrome.scripting.executeScript({
    target: { tabId: id, allFrames: true },
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

const handleSuccess = (data, elmTitle, elmDuration, elmVideo) => {
    if (data.items.length > 0) {
      console.log("output:", data.items[0]); // contentDetails.duration //snippet.title //snippet.channelTitle //snippet.description
    //   console.log("Video query output:", output);
      const duration = data.items[0].contentDetails.duration; //Must be ISO parsed
      const title = data.items[0].snippet.title;
      const channel = data.items[0].snippet.channelTitle;
      const description = data.items[0].snippet.description;   

      console.log(duration);
      elmTitle.value = title;
      elmVideo.value = channel;
      elmDuration.value = ISO8601DurationToSeconds(duration);
    }
  };

const checkURL = (url) => {
    const pattern = /youtube/i;

    if (pattern.test(url)) {
        return "youtube";
        console.log("The URL is from YouTube.com");
    } else {
        return "article";
        console.log("The URL is not from YouTube.com");
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

export { ISO8601DurationToSeconds, injectContentScript, getVideoID, handleSuccess, checkURL, checkApiKey } ;


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
	     
}

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

export { ISO8601DurationToSeconds, injectContentScript, getVideoID, handleSuccess, checkURL } ;
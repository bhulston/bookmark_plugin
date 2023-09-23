console.log("content script running");
//Content script runs a script that gets the relevant information from the webpage DOM.

{
    
try { 
    const article = document.querySelector("article");

    if (article) {
        console.log(article);
        const text = article.textContent;
        const wordMatchRegExp = /[^\s]+/g; // Regular expression
        const words = text.matchAll(wordMatchRegExp);
        // matchAll returns an iterator, convert to array to get word count
        const wordCount = [...words].length;
        const readingTime = Math.round(wordCount / 200);
      
        console.log("The word count is", wordCount);
        console.log("The reading time is", readingTime);
      
        chrome.runtime.sendMessage({ words: wordCount, time: readingTime}); //Send to background.js
       
    } else {
          console.log("No article in document found");
          const wordCount = "N/A";
          const readingTime = "N/A"; 
          chrome.runtime.sendMessage({ words: wordCount, time: readingTime}); //Send to background.js
    }
} catch (error) {
        console.log("Error:", error);
        console.log("Article already loaded, using previous load data...");

        const wordCount = "N/A";
        const readingTime = "N/A"; 
        chrome.runtime.sendMessage({ words: wordCount, time: readingTime}); //Send to background.js
    }
};





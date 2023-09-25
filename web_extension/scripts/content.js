console.log("content script running");
//Content script runs a script that gets the relevant information from the webpage DOM.

{
try { 
    const article = document.querySelector("article");
    const h1 = document.querySelector("h1");

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
        chrome.runtime.sendMessage({ article: true, words: wordCount, time: readingTime }); //Send to background.js
       
    } else {
          console.log("No article in document found");
          const wordCount = "N/A";
          const readingTime = "N/A"; 
          chrome.runtime.sendMessage({ article: false }); //Send to background.js
    }

    if (h1) {
        console.log(h1);
        const title = h1.textContent;
        const wordMatchRegExp = /[^\s]+/g; 
        const words = title.matchAll(wordMatchRegExp);

        chrome.runtime.sendMessage({header: true, title: title});
    } else {
        console.log("No header in document found");
        const title = "Example Title"

        chrome.runtime.sendMessage({header: false});
    }
    } catch (error) {
        console.log("Error:", error);
    }
};





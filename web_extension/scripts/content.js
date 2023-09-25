console.log("content script running");
//Content script runs a script that gets the relevant information from the webpage DOM.

{
try { 
    const article = document.querySelector("article");
    const h1 = document.querySelector("h1");
    const authorElement = document.querySelector('[data-testid="authorName"]'); // For medium articles

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

        chrome.runtime.sendMessage({header: true, title: title});
    } else {
        console.log("No header in document found");
        const title = "Example Title"

        chrome.runtime.sendMessage({header: false});
    }
    if (authorElement) {
        // You've found the element
        const author = authorElement.textContent;

        chrome.runtime.sendMessage({author: true, authorID: author});
    } else {
        // Element not found
        console.log("Element with data-testid 'authorName' not found.");
        chrome.runtime.sendMessage({author: false});
    }

    } catch (error) {
        console.log("Error:", error);
    }

    
};





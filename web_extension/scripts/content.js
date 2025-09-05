chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg?.action === "scrape") {
    (async () => {
      console.log("content script running");

      const FALLBACKS = {
        title: ['readability', 'manual'],
        author: ['readability', 'manual'],
        content: ['readability', 'manual']
      };

      if (window.location.href.includes("youtube.com")) {
        let pageTitle = '';
        let author = '';

        try {
          pageTitle = document.querySelector('meta[name="title"]')?.getAttribute('content');
          let authorSpan = document.querySelector('span[itemprop="author"]')?.querySelector('link[itemprop="name"]');
          author = authorSpan?.getAttribute('content');
        } catch (er) {
          chrome.runtime.sendMessage({ success: false, error: er.toString() });
          console.log("Youtube page error: try refreshing");

          try {
            pageTitle = document.querySelector('title')?.innerText;
          } catch (e) {
            console.log("Youtube fallback error:", e);
            chrome.runtime.sendMessage({ success: false, error: e.toString() });
          }
        }

        if (pageTitle) {
          chrome.runtime.sendMessage({ header: true, title: pageTitle });
        }

        if (author) {
          chrome.runtime.sendMessage({ author: true, authorID: author });
        }

        return;
      } else {

      try {
        const pageTitle = await fallback('title');
        const author = await fallback('author');
        const content = await fallback('content');

        const wordCount = content ? countWords(content) : 0;
        const readingTime = wordCount ? Math.round(wordCount / 200) : 0;

        if (pageTitle) {
          chrome.runtime.sendMessage({ header: true, title: pageTitle });
        }

        if (author) {
          chrome.runtime.sendMessage({ author: true, authorID: author });
        }

        if (content) {
          chrome.runtime.sendMessage({ content: true, words: wordCount, time: readingTime });
        }

        const fallback_log = getSourceUsed(pageTitle, author, content);
        chrome.runtime.sendMessage({ scrapelog: fallback_log });

      } catch (e) {
        console.error("Scraper error:", e);
        chrome.runtime.sendMessage({ success: false, error: e.toString() });
      }

      // --- Helper Functions ---
      async function fallback(type) {
        for (const method of FALLBACKS[type]) {
          switch (method) {
            case 'readability':
              const readability = tryReadability();
              if (readability && readability[type]) return readability[type];
              break;
            case 'manual':
              const manual = tryManual(type);
              if (manual) return manual;
              break;
            default:
              console.warn("Unknown fallback method:", method);
          }
        }
        return null;
      }

      function tryReadability() {
        try {
          const clone = document.cloneNode(true);
          const reader = new Readability(clone);
          const article = reader.parse();
          if (!article) return null;
          return {
            title: article.title,
            author: article.byline,
            content: article.textContent
          };
        } catch (e) {
          console.warn("Readability failed:", e);
          return null;
        }
      }

      function tryManual(type) {
        switch (type) {
          case 'title':
            return (
              document.querySelector('h1')?.textContent?.trim() ||
              document.querySelector('meta[property="og:title"]')?.content?.trim() ||
              document.title?.trim() ||
              null
            );
          case 'author':
            return (
              document.querySelector('[data-testid="authorName"]')?.textContent?.trim() ||
              document.querySelector('meta[name="author"]')?.content?.trim() ||
              document.querySelector('[itemprop="author"]')?.textContent?.trim() ||
              null
            );
          case 'content':
            const article = document.querySelector('article') ||
              document.querySelector('main') ||
              document.querySelector('[role="main"]') ||
              document.querySelector('[class*="content"]') ||
              document.querySelector('[class*="article"]');
            return article?.innerText?.trim() || null;
          default:
            return null;
        }
      }

      function countWords(text) {
        const wordMatchRegExp = /[^\s]+/g;
        const words = text.matchAll(wordMatchRegExp);
        return [...words].length;
      }

      function getSourceUsed(title, author, content) {
        const used = [];
        const readability = tryReadability();
        if (readability?.title === title) used.push('readability:title');
        if (readability?.author === author) used.push('readability:author');
        if (readability?.content === content) used.push('readability:content');
        if (!used.length) used.push('manual');
        return used.join(', ');
      }
    }})();
  }
});


// // --- MAIN EXECUTION ---
// if (window.location.href.includes("youtube.com")) {
//     let pageTitle = '';
//     let author = '';

//     try {
//         pageTitle = document.querySelector('meta[name="title"]').getAttribute('content');
//         let authorSpan = document.querySelector('span[itemprop="author"]').querySelector('link[itemprop="name"]');
//         author = authorSpan.getAttribute('content');
//     } catch (er) {
//         chrome.runtime.sendMessage({ success: false, error: er.toString() });
//         console.log("Youtube page was open too long, try refreshing the page");

//         try {
//             pageTitle = document.querySelector('title').innerText;
//         } catch (e) {
//             console.log("Youtube Scraping error:", e);
//             chrome.runtime.sendMessage({ success: false, error: e.toString() });
//         }
//     }

//     if (pageTitle) {
//         chrome.runtime.sendMessage({ header: true, title: pageTitle });
//     }

//     if (author) {
//         chrome.runtime.sendMessage({ author: true, authorID: author });
//     }
// } else {
//     // 👇 ASYNC WRAPPER HERE
//     (async () => {
//         try {
//             const pageTitle = await fallback('title');
//             const author = await fallback('author');
//             const content = await fallback('content');

//             const wordCount = content ? countWords(content) : 0;
//             const readingTime = wordCount ? Math.round(wordCount / 200) : 0;
//             console.log(pageTitle, author, content);

//             if (pageTitle) {
//                 chrome.runtime.sendMessage({ header: true, title: pageTitle });
//             }

//             if (author) {
//                 chrome.runtime.sendMessage({ author: true, authorID: author });
//             }

//             if (content) {
//                 chrome.runtime.sendMessage({ content: true, words: wordCount, time: readingTime });
//             }

//             console.log("Messages sent to background.js");

//             const fallback_log = getSourceUsed(pageTitle, author, content);
//             chrome.runtime.sendMessage({ scrapelog: fallback_log });

//         } catch (e) {
//             console.error("Scraper error:", e);
//             chrome.runtime.sendMessage({ success: false, error: e.toString() });
//         }
//     })(); 
// }





//     //Not youtube
//     try {
//         // We use "querySelector" as it's more flexible, lightweight, and browser native
//         const article = document.querySelector("article");
//         const h1 = document.querySelector("h1");
//         const authorElement = document.querySelector('[data-testid="authorName"]'); // For medium articles

//         if (article) {
//             const text = article.textContent;
//             const wordMatchRegExp = /[^\s]+/g; // Regular expression
//             const words = text.matchAll(wordMatchRegExp);
//             // matchAll returns an iterator, convert to array to get word count
//             const wordCount = [...words].length;
//             const readingTime = Math.round(wordCount / 200);
        
//             chrome.runtime.sendMessage({ article: true, words: wordCount, time: readingTime }); //Send to background.js
        
//         } else {
//             console.log("No article in document found");
//             chrome.runtime.sendMessage({ article: false }); //Send to background.js
//         }

//         if (h1) {
//             const title = h1.textContent; 

//             chrome.runtime.sendMessage({header: true, title: title});
//         } else {
//             console.log("No header in document found");

//             chrome.runtime.sendMessage({header: false});
//         }
//         if (authorElement) {
//             // You've found the element
//             const author = authorElement.textContent;

//             chrome.runtime.sendMessage({author: true, authorID: author});
//         } else {
//             // Element not found
//             console.log("Element with data-testid 'authorName' not found.");
//             chrome.runtime.sendMessage({author: false});
//         }

//         } catch (error) {
//             console.log("Error:", error);
//         }

// } 
// };





# Obsidian Bookmarks
---

This is a chrome extension that uses [Obsidian](https://obsidian.md) as an alternative to saving links in your chrome bookmarks. If you are like me, you: <br />
1. Never end up going back to your Chrome bookmarks<br />
  2. Need a way to take notes along with your saved articles/papers/videos...<br />

If you have these problems as well, and are an avid user of Obsidian, I think you will find this tool very helpful!

## Functionality
---

Given that I watch a lot of Youtube videos, I also incorporated the YouTube V3 API (get your key [here](https://console.developers.google.com/)), which will get the video duration time along with other relevant information. <br /><br />

Here is a list of the features you can expect with this chrome extension:<br />
 - **Append your bookmark** to an existing Obsidian file, and/or create a new note<br />
 - Quickly choose from your own Obsidian files where to save your bookmark<br />
 - **Automatically search for article/video titles** in the Webpage DOM and save them to Obsidian<br />
 - Estimates and saves read time of article (or watch duration for Youtube videos)<br />
 - Add a **custom note** to your bookmarks/edit MD template<br />



## Demo
---

https://github.com/bhulston/bookmark_plugin/assets/79114425/8e93bee0-a54c-4c40-ad45-fff9c1e9b80c

## User Guide
---
A few tips from me!<br />

### YAML and MD Templates
Both of these can be edited from the options page by clicking the cog in the extension.
When making templates, there are a few built in fields that you can include:

1. ${url}
2. ${title}
3. ${author}
4. ${time}



A YAML template only is included when a new note is created and assigns page properties. It begins and ends with "---" as seen in the below example:

```
---
{
    "title": ${title},
    "time": ${time},
    "author": ${author},
    "url": ${url},
    "read": false,
    #bookmark
}
---
```

Markdown templates simply get appended to existing files! Here is an example to get you started:
```

[${title}](${url})
${time}
${author}
```
Notice that I include a space, so that a space exists between each bookmark on a page. The " [ title ]|( url ) " format creates a hyperlink in Obsidian. <br />
<br />
##### Example Bookmarks Page:
<img width="1512" alt="Screenshot 2023-11-09 at 5 18 42 PM" src="https://github.com/bhulston/bookmark_plugin/assets/79114425/952bd105-8af4-4679-b342-e09c5c023c89">


### Other Tips:

1. You can set your default bookmark locations and templates in the options page.
2. When using the new note section, the title section is automatically used as the document's name.
3. You can turn off the author and time sections in the options settings, just make sure to also edit your templates appropriately!
4. I noticed that the Google API is not 100% reliable, so just re-click the extension in chrome to have it try again.


## Setup
---

#### Obsidian API
This extension uses the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api#) plugin to interact with your Obsidian from your Chrome browser. This means that you need to have this plugin functioning in your preferred vault in order for the chrome extension to work.

A way to test that your Obsidian API is setup properly would be with their [interactive docs](https://coddingtonbear.github.io/obsidian-local-rest-api/).

#### Install
[link-chrome]: https://chrome.google.com/webstore/detail/testname/xxx 'Version published on Chrome Web Store'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/hlepfoohegkhhmjieoechaddaejaokhf.svg?label=%20">][link-chrome] and other Chromium browsers


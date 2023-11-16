# Obsidian Bookmarks
---

This is a chrome extension that uses [Obsidian](https://obsidian.md) as an alternative to saving links in your chrome bookmarks. If you are like me, you: <br />
1. Never end up going back to your Chrome bookmarks<br />
  2. Need a way to take notes along with your saved articles/papers/videos...<br />

If you have these problems as well, and are an avid user of Obsidian, I think you will find this tool very helpful!

# Table of Contents
---
1. [Functionality](#functionality)
2. [Demo](#demo)
3. [Setup](#setup)
   - [Obsidian API](#obsidian-api)
   - [The Options Page](#the-options-page)
   - [Install It Yourself](#install-it-yourself)
   - [Install on the Chrome Web Store (Awaiting Approval)](#install-on-the-chrome-web-store---awaiting-approval)
4. [User Guide + Templates](#user-guide)


## Functionality
---

Given that I watch a lot of Youtube videos, I also incorporated the YouTube V3 API (get your key [here](https://console.developers.google.com/)), which will get the video duration time along with other relevant information. <br /><br />

Here is a list of the features you can expect with this chrome extension:<br />
 - **Append your bookmark** to an existing Obsidian file, and/or create a new note<br />
 - Create **MD and YAML templates** that are used by default, and **customize on the fly** as well
 - Quickly choose from your own Obsidian files where to save your bookmark<br />
 - **Automatically searches for article/video titles** in the Webpage DOM and save them to Obsidian<br />

## Demo
---

https://github.com/bhulston/bookmark_plugin/assets/79114425/8e93bee0-a54c-4c40-ad45-fff9c1e9b80c


## Setup
---

### Obsidian API
This extension uses the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api#) plugin to interact with your Obsidian from your Chrome browser. You can find it on the Obsidian community plugins page too.
<br></br> A way to test that your Obsidian API is setup properly would be with their [interactive docs](https://coddingtonbear.github.io/obsidian-local-rest-api/).

### The Options Page

Once downloaded, be sure to set your options and templates

Add your Obsidian API key and templates(examples in the [User Guide](#user-guide) section), and save settings to get the extension working in Chrome. <br></br>
<img width="289" alt="Screenshot 2023-11-14 at 12 46 39 PM" src="https://github.com/bhulston/bookmark_plugin/assets/79114425/8f475892-486f-4388-8a6c-e5f64f68232a">

<br> </br> You are also be able to check if the API key is working from this page. <br> </br>

<img width="701" alt="Screenshot 2023-11-14 at 12 45 46 PM" src="https://github.com/bhulston/bookmark_plugin/assets/79114425/d25b934c-41f7-48ae-a25f-87a91a3e99a1">


### Install It Yourself
##### 1. Download the Repo
<img width="1030" alt="Screenshot 2023-11-14 at 11 56 12 AM" src="https://github.com/bhulston/bookmark_plugin/assets/79114425/69defc6f-83ee-481e-9098-d972d857d1aa">
<br> </br> Easiest way is to download the zip file, but you could git clone the repo as well

##### 2. Unpack the Zip File
Just double click the zip file

##### 3. Go to Chrome Extensions in Development Mode and Load Unpacked
<img width="1506" alt="Screenshot 2023-11-14 at 12 10 18 PM" src="https://github.com/bhulston/bookmark_plugin/assets/79114425/07a6ff6e-73ea-4d0f-8541-21d1ae3f1f44">
<br> </br> First turn on development mode (in the top right), and then you will click the load unpacked button (in the top left)

##### 4. Select the web_extension File in the Unpacked File
<img width="798" alt="Screenshot 2023-11-14 at 12 05 05 PM" src="https://github.com/bhulston/bookmark_plugin/assets/79114425/2198c6f9-f625-4d21-ba5d-9ecb75ffec4d">

##### 5. Leave Development Mode and Start Using!
And you are done! <br> </br>

#### Install on the Chrome Web Store - Awaiting Approval
[link-chrome]: https://chrome.google.com/webstore/detail/testname/xxx 'Version published on Chrome Web Store'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/hlepfoohegkhhmjieoechaddaejaokhf.svg?label=%20">][link-chrome] and other Chromium browsers


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

Note that you could add an additional note below the final '---' to add text after the yaml properties. <br />

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



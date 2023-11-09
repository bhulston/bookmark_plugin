# Obsidian Bookmarks
---

This is a chrome extension that uses [Obsidian](https://obsidian.md) as an alternative to saving links in your chrome bookmarks. If you are like me, you:
    1. Never end up going back to your Chrome bookmarks
    2. Need a way to take notes along with your saved articles/papers/videos...

If you have these problems as well, and are an avid user of Obsidian, I think you will find this tool very helpful!

## Functionality
---

Given that I watch a lot of Youtube videos, I also incorporated the YouTube V3 API (get your key [here](https://console.developers.google.com/)), which will get the video duration time along with other relevant information. 

Here is a list of the features you can expect with this chrome extension:
    1. Append your bookmark to an existing Obsidian file, and optionally create a corresponding note for your bookmark
    2. Quickly choose from your own Obsidian file structure where you want to save your bookmark
    3. Automatically search for article/video titles in the Webpage DOM and save them to Obsidian
    4. Estimates and saves read time of article (or watch duration for Youtube videos)
    5. Add a custom note to your bookmarks

## Demo
---
![Demo](https://github.com/bhulston/bookmark_plugin/blob/main/Demo.mp4)


## Setup
---

#### Obsidian API
This extension uses the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api#) plugin to interact with your Obsidian from your Chrome browser. This means that you need to have this plugin functioning in your preferred vault in order for the chrome extension to work.

A way to test that your Obsidian API is setup properly would be with their [interactive docs](https://coddingtonbear.github.io/obsidian-local-rest-api/).

#### Install
[link-chrome]: https://chrome.google.com/webstore/detail/testname/xxx 'Version published on Chrome Web Store'

[<img src="https://raw.githubusercontent.com/alrra/browser-logos/90fdf03c/src/chrome/chrome.svg" width="48" alt="Chrome" valign="middle">][link-chrome] [<img valign="middle" src="https://img.shields.io/chrome-web-store/v/hlepfoohegkhhmjieoechaddaejaokhf.svg?label=%20">][link-chrome] and other Chromium browsers


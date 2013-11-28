# Personal website

A simple website using markdown files hosted on github for content.

The philosophy is to deliver highly optimized pages:
- CSS is reduced to the strict minimum using [grunt-uncss](https://github.com/addyosmani/grunt-uncss/)
- CSS is directly included in the html page to reduce the number of requests
- Javascript is reduced to one minimized file using [grunt-requirejs](https://github.com/asciidisco/grunt-requirejs) loaded at the end of the page

As a result, all the pages delivered have more than 95/100 on desktop and mobile on [Google PageSpeed Insights](http://developers.google.com/speed/pagespeed/insights/?url=xdamman.com%2Fthe-hidden-power-of-twitter-custom-timelines&tab=mobile).

## Features
- Posts are markdown files (can be hosted in a [github repository](https://github.com/xdamman/website-content/blob/master/posts/the-hidden-power-of-twitter-custom-timelines.md))
- Fully responsive using [Bootsrap v3](http://getbootstrap.com)
- Minimalistic design focused on [content consumption](http://xdamman.com/the-hidden-power-of-twitter-custom-timelines)

![](http://images.weserv.nl/?w=320&url=photos-2.dropbox.com/t/0/AACw6pqg-In-WeWJtKIwSQLE0EvoW4YeB6GXOpzkOAK2gg/12/1702667/png/2048x1536/3/1385622000/0/2/Screenshot%202013-11-27%2021.59.42.png/pX9t6IKmwW-LxGh5C5Yb2nPghc55r8_eYd_Wn57Toio)


## Examples

- [xdamman.com](http://xdamman.com)
- (please add your site here if you use this node server)

## Installation

    npm install personal-website
    

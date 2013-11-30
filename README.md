# Personal website

A simple website using markdown files hosted on github for content.

The philosophy is to deliver highly optimized pages:
- CSS is reduced to the strict minimum using [grunt-uncss](https://github.com/addyosmani/grunt-uncss/)
- CSS is directly included in the html page to reduce the number of requests
- Javascript is reduced to one minimized file using [grunt-requirejs](https://github.com/asciidisco/grunt-requirejs) loaded at the end of the page

As a result, all the pages delivered have more than 95/100 on desktop and mobile on [Google PageSpeed Insights](http://developers.google.com/speed/pagespeed/insights/?url=xdamman.com%2Fthe-hidden-power-of-twitter-custom-timelines&tab=mobile).

## Features
- Posts are [markdown](http://en.wikipedia.org/wiki/Markdown) files (can be hosted in a [github repository](https://github.com/xdamman/website-content/blob/master/posts/the-hidden-power-of-twitter-custom-timelines.md))
- Fully responsive using [Bootsrap v3](http://getbootstrap.com)
- Minimalistic design focused on [content consumption](http://xdamman.com/the-hidden-power-of-twitter-custom-timelines)

![](http://images.weserv.nl/?w=320&url=photos-2.dropbox.com/t/0/AACw6pqg-In-WeWJtKIwSQLE0EvoW4YeB6GXOpzkOAK2gg/12/1702667/png/2048x1536/3/1385622000/0/2/Screenshot%202013-11-27%2021.59.42.png/pX9t6IKmwW-LxGh5C5Yb2nPghc55r8_eYd_Wn57Toio)


## Examples

- [xdamman.com](http://xdamman.com)
- (please add your site here if you use this node server)

## Installation


1. Clone the repo

    `git clone git@github.com:xdamman/website`
  
1. Run `npm install` 

1. A prompt will ask you what repository you want to use for the content of the site. Your best option is to clone the default content repository (http://github.com/xdamman/website-content) and use that new git URL. It's fine to keep the default one if you just want to test the server. You can always change it later by editing the line `website-content` in `package.json`.

1. Start the web server by running `npm start`
    
## Edit the content
The content of the site lives in a separate repository. This is by design for two reasons: 

1. You can make the content repo public and allow anyone to submit pull requests to edit the content without having to worry about the code of the server.
1. You can create new content or edit it without having to redeploy the server (you can configure a github webhook to notify the server when there is an update in the content repo. The POST route is `/webhooks/github`).
   
This repo should contain 3 directories:
 
- `/posts`: where your posts are (they need to have a `.md` extension (for [markdown](http://en.wikipedia.org/wiki/Markdown)))
- `/partials`: partial content that can be used in the views. For now, there is only a `about.md` that we render at the top of the homepage and at the bottom of every post. 
- `/public`: public directory where you can store any static asset. They will be available from `http://localhost:3000/public`

## Running on production

To run on production, you will need to run it as `sudo` to bind it to the port 80. Otherwise you can keep it on any other custom port and put [Varnish](https://www.varnish-cache.org/) or [Nginx](http://wiki.nginx.org/Main) in front (I'm personally running it directly on port 80 and I use [cloudflare](http://cloudflare.com) for caching at the CDN level. 

    sudo NODE_ENV=production NODE_PORT=80 node server.js
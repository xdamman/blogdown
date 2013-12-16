# BlogDown

Github pages are great for a static website. But you can't really use them to power your blog. BlogDown is a NodeJS server that uses a github repo to render a blog. Your posts are markdown files within a `posts/` directory. That simple. 

## Who is this for?

By using github for storing the posts, it's very easy to manage who can write and edit them. That makes it great to use for your company engineering blog for example since all your engineers already have access to your repos. You don't need to create a Wordpress or Tumblr or whatever and deal with access rights.

It's also great for a personal website. Especially if you write technical posts or if your friends are on github and you want to make it easy for them to collaborate with you on your next blog post. 

## The stack

It's a simple NodeJS server. There is no database. All the content is in a separate content repo. 

## Installation


1. Clone the repo

    `git clone git@github.com:xdamman/blogdown.git`
  
1. Run `npm install` 

1. Start the web server by running `npm start`

Then open your browser to `http://localhost:3000` and follow the instructions on the screen. You will have to make sure that your server has a public IP (or domain) so that Github can send a webhook to it. 

![](http://f.cl.ly/items/3T1x1R340Y0h0Z0E3T1d/blogdown-setup.png)


## Features
- Posts are [markdown](http://en.wikipedia.org/wiki/Markdown) files (can be hosted in a [github repository](https://github.com/xdamman/website-content/blob/master/posts/the-hidden-power-of-twitter-custom-timelines.md))
- Fully responsive using [Bootsrap v3](http://getbootstrap.com)
- Minimalistic design focused on [content consumption](http://xdamman.com/the-hidden-power-of-twitter-custom-timelines)
- Automatically reflects the latest changes in your content thanks to webhooks

## Examples

- [xdamman.com](http://xdamman.com)
- (please add your site here if you use this node server)

    
## Edit the content
The content of the site lives in a separate repository. This is by design for two reasons: 

1. You can make the content repo public and allow anyone to submit pull requests to edit the content without having to worry about the code of the server.
1. You can create new content or edit it without having to redeploy the server (you need to configure a github webhook to notify the server when there is an update in the content repo. The POST route is `/webhooks/github`).
   
This repo should contain 3 directories:
 
- `/posts`: where your posts are (they need to have a `.md` extension (for [markdown](http://en.wikipedia.org/wiki/Markdown)))
- `/partials`: partial content that can be used in the views. For now, there is only a `about.md` that we render at the top of the homepage and at the bottom of every post. 
- `/public`: public directory where you can store any static asset. They will be available from `http://localhost:3000/public`

## Running on production

To run on production, you will need to run it as `sudo` to bind it to the port 80. Otherwise you can keep it on any other custom port and put [Varnish](https://www.varnish-cache.org/) or [Nginx](http://wiki.nginx.org/Main) in front (I'm personally running it directly on port 80 and I use [cloudflare](http://cloudflare.com) for caching at the CDN level. 

    sudo NODE_ENV=production NODE_PORT=80 node server.js
    
### Using an upstart script [recommended]

You can copy the `blogdown.upstart.conf` script at the root of this repo to `/etc/init/blogdown.conf`. Just modify the path to where your blogdown installation is. Then you are good to go. You can start/stop the service using `sudo start blogdown`.
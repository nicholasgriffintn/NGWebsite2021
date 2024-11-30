---
title: "How I built a blog with Node, Express and Mongo"
description: "Let's get blogging!"
date: "2019-02-04T15:48"
archived: true
tags: [node, express, mongo]
---

So with the move to my new server, I had to create something that would allow me to create a set blog post like the one you are reading now. One of my aims for 2019 and onwards is to do more development and projects that don't really have any aim, simply to learn new stuff.

To kick that off, I needed some kind of platform that would allow me to submit posts to my site, over an authenticated user but without using any kind of third party, as I want my new site to depend on fewer third-parties and the whole aim of this project is to do more for myself.

So I got to work on a new platform that uses the Express basis that I previously created alongside Mongo for storing the posts and Passport.js for the JWT authentication on the APIs that I would be creating. For now the blog platform is all API based, however, I will be expanding this with a full login and dashboard system soon.

## Let's get started

Before you can begin this for yourself, you will need to create a starter Node application with Express installed, there are numerous tutorials around the web for doing this and the platform changes regularly so it might be best to do some Googling for that part.

Once you have a Node app ready, you will need to get a Mongo server setup and you will need to install the Mongoose package within your Node application.

On a mac, you can install a Mongo server with the following command:

```bash
brew install mongo  
mkdir -p /data/db  
sudo chown -R `id -un` /data/db
```

Once complete, simply run mongod to startup your Mongo DB on localhost. For a server, you may want to look into something different. Personally, I quite like the MongoDB Cloud service for development.

And for the Mongoose install, run the following within your Node terminal (you may have to open a new window).

```bash
npm install mongoose --savenpm install mongoose --save
```

Then in your main app.js file add the following to start the mongodb server:

```javascript
var mongoose = require('mongoose')  
mongoose.connect("mongodb://localhost:27017/my-blog")
```

You may need to change localhost to your domain if you are using something else, alongside the ending database name. I've set it as my-blog for now for this post.

### Setting up body parser

While we are entering commands, it would be a good idea to install body parser from NPM. This module works great for parsing data that has been passed to your application, we will be using it to parse the data that is passed to the POST API that we will be setting up later.

To get started with body parser, run the following command in your Terminal window:

```bash
npm install body-parser
```

Then include the following within your main application file:

```javascript
var bodyParser = require('body-parser')  
app.use(bodyParser.json())  
app.use(bodyParser.urlencoded({ extended: true}))
```

### Setting up the Mongo schema

We are almost done but before we can start sending blog post data we will need to set up our Mongo database table and the schema that will be linked to that table.

To do that, you will need to add the following to your main application file:

```javascript
var postSchema = new mongoose.Schema({ posttype: String, title: String, date: String, image: String, excerpt: String, body:  String })

var Post = mongoose.model('Post', postSchema);
```

I've added a few items to the schema here, but basically, you just need to set what your mongo will accept and the type that it should expect. You can find out more about Mongoose schemas here.

### Setting up your API for adding new posts

For this first part, we will be setting up a simplistic API for adding new posts, however, I am aiming to release another blog post soon with more about authenticating APIs with Passport.js. I didn't want to fill this one with too much just yet.

Anyway, to set up your new API you will need to include the following within your application file:

```javascript
app.post('/launchpost', (req, res) => {  
    var postData = new Post(req.body);  
    postData.save().then( result => {  
        res.redirect('/');  
    }).catch(err => {  
        res.status(400).send("Unable to save data");  
    });  
});
```

This is a pretty simplistic listener that will link to any post request sent to the '/launchpost' path on your domain, you can change this to whatever you like as the name doesn't really matter.

When someone sends a post request to this path it will grab the data from the body, save it in your configured Mongo table and then redirect the user to the homepage.

If you'd prefer to not have the redirect, you could change that line to the following:

```javascript
res.status(200).send("Post saved.");
```

It will then simply send back a message that says 'Post saved', you could also expand this to send back the generated post ID.

You can query this API with Postman like this:

![Postman](/uploads/node-express-mongo-blog/postman_get.jpeg)

### Setting up your API for removing posts

Sometimes you might want to remove a post that you have previously added so it might also make sense to create an API that will allow you to easily remove posts that you have previously published. You can do that with the following:

```javascript
app.post('/removepost', (req, res) => {  
    var postData = new Post({_id: req.body.id});  
    postData.remove().then( result => {  
        res.redirect('/');  
    }).catch(err => {  
        res.status(400).send("Unable to remove data");  
    });  
});
```

Again, feel free to change the name of the post or how it responds.

And querying it in Postman will look like this:

![Postman](/uploads/node-express-mongo-blog/postman_post.jpeg)

### Displaying your blog post

Now that you have your APIs ready, you should probably set up a page to do this.

Personally, I quite like how the EJS templating engine works, so we will be using that to build the templates and then ultimately show the posts.

You can install EJS via your terminal window with the following command:

```bash
npm install ejs --save
```

You will then need to add the following to your application so that Express will use the engine:

```javascript
app.engine('html', require('ejs').renderFile);  
app.set('view engine', 'html');
```

By default, EJS will look for template files in a directory named 'views' so you will need to create that and then add an index.html file within that directory.

There's a lot you can do with EJS in terms of templates, however, for this tutorial we are going to keep things simple, so within this html file we will simply be adding the code to display our posts, feel free to take at look at the EJS documentation to learn more about how to use it.

But before then, be sure to include the following code within your index.html file for the displaying of blog posts:

```html
<% if(posts){ %> 
    <% for(let i = 0; i < posts.length; i++) { %> 
        <div class="card">
            <div class="image">
                <img src="<%= posts[i].image %>">
            </div>
            <div class="content">
                <a class="header"><%= posts[i].title %></a>
                <div class="meta">
                    <span class="date"><%= posts[i].date %></span>
                </div>
                <div class="description">
                    <%= posts[i].excerpt %>
                </div>
            </div>
            <div class="extra content">
                <a class="ui button primary basic inverted" href="/post-single?postID=<%= posts[i]._id %>">
                    Read more
                </a>
            </div>
        </div>
    <% } %> 
<% } %>
```

Finally, you'll need to add the route for your homepage like the following:

```javascript
app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        res.render('index', { posts: posts });
    });
});
```

And for our single page route (you'll need create a page for this like the homepage):

```javascript
app.get("/post-single", (req, res) => {
    Post.find({ '_id': req.query.postID }, (err, posts) => {
        res.render('post-single', { posts: posts });
    }).sort({ date: 'descending' });
});
```

![Celebration](https://media.giphy.com/media/s2qXK8wAvkHTO/giphy.gif)

You are ready to get blogging. Of course, you will probably want to authenticate this and you probably don't want to be adding post via Postman... Stay tuned for when I remember to talk about doing that...

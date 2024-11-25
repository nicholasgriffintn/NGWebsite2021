---
title: "Adding authentication to our Express blog with Passport.js"
description: "Time to make things secure"
date: "2019-04-19T15:48"
archived: true
tags: [node, express, mongo, passport]
---

In the last blog post we talked about [adding a blog to our personal site via Node, Express and Mongo](/blog/node-express-mongo-blog). In this blog post, we will be expanding upon that by adding authentication to our new Express APIs via something called Passport.js.

We will be going through the backend side of the code only during this post, creating a set of APIs for creating users, generating tokens for users, logging users in and requiring authentication for our APIs.

Let's get started.

## Setting up our app

For this post, I am going to expect that you have already set up a node environment, and have Mongo set up and ready to go. If you still need to do that, then it might be best to find a tutorial on how to do that before you follow this.

To start, you'll need to make sure that you have the following packages installed and included within your main application file:

```javascript
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');
```

Now you will need to configure Mongose to use global promises and setup Express to use your modules and set up your sessions.

```javascript
// Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

// Initiate our app
const app = express();

// Configure our app
app.use(cors());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my-super-secret-key',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false
}));
```

Make sure that you change your key to something really secret.

## Storing user data

Now that you have set up and configured your app, you will need to create your model for the Users database that you will need for the next steps.

To do this, you will need to create a new folder called "models" and then create a file within that folder called "Users.js".

We will be using this folder to define the schema for our users, hashing user passwords, generating a salt and creating the JWT that we will need latter. This file should look something like this:

```javascript
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  email: String,
  hash: String,
  salt: String,
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);

  return jwt.sign({
    email: this.email,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
};

UsersSchema.methods.toAuthJSON = function() {
  return {
    _id: this._id,
    email: this.email,
    token: this.generateJWT(),
  };
};

mongoose.model('Users', UsersSchema);
```

To use this model, you will need to add the following to your application file under the line where you are setting up Mongo.

```javascript
require('./models/Users');
```

## Setting up our Passport.js config

Now that we have set up our users model, we are ready to get started with our configuration for Passport.js.

To do this and keep it tidy we will need to create a new folder called "config", which we will be using for the storage of our configuration files for this part and for future requirements.

Within this folder, we need to create a new file named "passport.js".

```javascript
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = mongoose.model('Users');

passport.use(new LocalStrategy({
  usernameField: 'user[email]',
  passwordField: 'user[password]',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email or password': 'is invalid' } });
      }
      return done(null, user);
    })
    .catch(done);
}));
```

This will basically use our password validation function from users to direct the user to the correct output.

To link this all together, you will need to add the following line after your model set up:

```javascript
require('./config/passport');
```

## Setting up our authentication route

The final step is to set up a route that can be used for authentication.

To do this, we will create a new folder named "routes" and then within that, we will create a file named "auth.js". This will contain a function for getting a token from the user's request headers.

It does this by looking for a header named authorization and then splitting everything in the value after the word 'Token', the part that is returned should be our JWT.

If a JWT cannnot be found it will return null, which we can use to display an error through the API later.

```javascript
const jwt = require('express-jwt');

const getJWT = (req) => {
  const { headers: { authorization } } = req;

  if (authorization && authorization.split(' ')[0] === 'Token') {
    return authorization.split(' ')[1];
  }
  return null;
};
```

We then need to create our variable for both required and optional authenticatiion methods and then finally export that variable:

```javascript
const auth = {
  required: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getJWT,
  }),
  optional: jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getJWT,
    credentialsRequired: false,
  }),
};

module.exports = auth;
```

Now we need to link all of this to an API.

To do that, create a new file in your routes folder called "index.js" and add the following code to it:

```javascript
const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));

module.exports = router;
```

This will basically set up a new route that will link requests with the api pathname to a folder called api within our routes folder.

Create that api folder within your routes folder and then create another "index.js" file within that folder with the following:

```javascript
const express = require('express');
const router = express.Router();

router.use('/users', require('./users'));

module.exports = router;
```

And then, as you might have guessed from the code, we will need to create another file within the api folder called "users.js".

This is where you will host your users APIs.

## Creating your Users APIs

To start off, add the following to the top of your new file:

```javascript
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
```

You'll then need to add the following after that to register your APIs.

### New user API

```javascript
router.post('/', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if (!user.email) {
    return res.status(422).send("Something unexpected happened");
  }

  if (!user.password) {
    return res.status(422).send("Something unexpected happened");
  }

  const returnedUser = new Users(user);
  returnedUser.setPassword(user.password);

  return returnedUser.save()
    .then(() => res.json({ user: returnedUser.toAuthJSON() }));
});
```

### Login API

```javascript
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if (!user.email) {
    return res.status(422);
  }

  if (!user.password) {
    return res.status(422);
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return status(400).info;
  })(req, res, next);
});
```

## Adding authentication to our APIs

Now you are ready to add authentication to your APIs! Here's an example with the addpost API that I talked about in the last post about creating a blog within Mongo:

```javascript
const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Post = mongoose.model('Post');

// For creating posts
router.post('/addpost', auth.required, (req, res) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }

      var postData = new Post(req.body);
      postData.save()
        .then(result => {
          res.status(200).send("Post saved.");
        })
        .catch(err => {
          res.status(400).send("Unable to save data");
        });
    });
});
```

## And that's it!

You have now successfully added authentication to your Node Express setup. Next up is creating a full frontend system with a login and dashboard page for our blog

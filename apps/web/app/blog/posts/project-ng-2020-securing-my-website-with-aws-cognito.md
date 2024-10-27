---
title: "Project NG 2020: Securing my website with AWS Cognito"
description: "Easy website authentication ready for the future"
<<<<<<< Updated upstream
date: "Sunday, April 19 2020 3:48 pm"
=======
date: "2020-04-19T15:48"
>>>>>>> Stashed changes
archived: true
---

Alongside the [launch of my new website](/blog/project-ng-2020-re-launching-my-personal-website.md) with Next JS, Nginx, Postgres, and Express, I want to expand my site with more things.

To start, I need to get Authentication set up on the site so that we can lock off certain areas of the site, alongside any of the APIs that I don't want to be public.

There are a number of ways that I could do this, and in the past, [I have done this with a database and Passport.js on an Express server](/blog/adding-authentication-express-blog-passport.md), this time, we're doing it with a much cooler service AWS Cognito.

## What is AWS Cognito

In case you don't already know, AWS Cognito is an awesome add-on service from Amazon that makes it really simple to add sign-up, sign-in and access control across multiple apps, with the same system.

A few of the biggest reasons to use this over a custom service is not only that it means you move the responsibility of maintaining your auth service to AWS but also that it allows you to scale your application across many different platforms and add features like social sign-on and SAML authentication, without too much effort.

In my case, it's going to allow me to add authentication to my website, possibly a mobile app and even to microservices outside of my site, such as Lambda.

You can [find out more about the service here](https://aws.amazon.com/cognito/).

## Setting up our project

There are two main NPM pages that you can use with a React app, AWS Amplify and Amazon Cognito Identity JS, for me, I'm going to be using Amazon Cognito Identity JS as AWS Amplify provides a little more than I require for my use cases.

Installing that package is as simple as running the following:

`npm i amazon-cognito-identity-js`

Once that's installed, you'll just need to import it with the following:

```javascript
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';
```

Next up, you'll need to setup that package with your AWS Cognito credentials like the following:

```javascript
const userPool = new CognitoUserPool({
  UserPoolId: config.AUTH.UserPoolId,
  ClientId: config.AUTH.ClientId,
});
```

I'm using my config file here, but you could do it any way that you'd like to. It doesn't have to remain particularly secret as these details are revealed in requests.

## Creating authentication components

As we'll be using AWS Cognito in various places across our site, I'm going to create a couple of components for talking to Cognito.

The first of these is the checkIfLogged in component, which as the name suggests, will use the AWS Cognito package to check if the user is logged in our not.

```javascript
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { config } from '../config/config';

export default () => {
  const userPool = new CognitoUserPool({
    UserPoolId: config.AUTH.UserPoolId,
    ClientId: config.AUTH.ClientId,
  });

  const cognitoUser = userPool.getCurrentUser();

  if (cognitoUser && cognitoUser !== null) {
    return cognitoUser.getSession((err, res) => {
      if (err) {
        console.error('error with authentication: ', err);
        throw err;
      }
      if (res && res.isValid()) {
        return { user: res, loggedIn: res.isValid() };
      } else {
        return { user: res, loggedIn: false };
      }
    });
  } else {
    return { user: {}, loggedIn: false };
  }
};
```

Basically, that will just grab the session from Cognito and then return it with a JSON response.

We'll import this component on our packages to check if the user is logged in and to grab the user's details from Cognito, without having to re-write code.

## Creating our login page

Obviously, the first step of any authentication is to create a login page.

For my site, the login page is going to be pretty simple, but I presume this will grow further as I build more stuff, for now, it's going to be pretty basic as it's just me logging in anyway.

To start, I'm going to set the state for the username and password that we're going to us in our form:

```javascript
constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }
```

If the user is already logged in, we want to redirect the user to our dashboard page to make things easy:

```javascript
componentDidMount() {
    const { loggedIn } = checkLoggedIn();
    if (loggedIn) {
      redirect({}, "/dashboard");
    }
  }
```

Next, we need some base functions for the login form functionality:

```javascript
  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const authenticationData = {
      Email: email,
      Password: password,
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: email,
      Pool: userPool,
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        redirect({}, "/dashboard");
      },

      onFailure: function (err) {
        console.log("error ", err);
      },

      mfaRequired: function (codeDeliveryDetails) {
        var verificationCode = prompt("Please input verification code", "");
        cognitoUser.sendMFACode(verificationCode, this);
      },

      newPasswordRequired: function (userAttributes, requiredAttributes) {
        var newPassword = prompt("Please input a new password", "");

        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;

        cognitoUser.completeNewPasswordChallenge(
          newPassword,
          userAttributes,
          this
        );
      },
    });
  }
```

Again, pretty simplistic, the handleChange functions will just take the input value and set the state with that value.

The handleSubmit function will use the AWS Cognito package to check if the user exists and find the next step by sending the username and password input to AWS. AWS will respond with either an error, success or the next step.

onSuccess is for the success response, onFailure is for the failures, mfaRequired is for if the user has set up two-factor authentication and newPassRequired is if the user is required to set their password on login, this happens when the user first logs in or if they have been reset by an admin.

Then we just need to add a form to our page:

```javascript
render() {
    return (
      <Page displayHeader={true} title="Login">
        <div className="content-wrap">
          <div className="container-main">
            <div className="page-header-spacer"></div>

            <h1 id="single-title" className="animated bounceInDown">
              Sign in to the dashboard
            </h1>
            <form onSubmit={this.handleSubmit.bind(this)}>
              <div className="form-control">
                <input
                  type="text"
                  value={this.state.email}
                  placeholder="Email"
                  onChange={this.handleEmailChange.bind(this)}
                />
              </div>
              <div className="form-control">
                <input
                  type="password"
                  value={this.state.password}
                  placeholder="Password"
                  onChange={this.handlePasswordChange.bind(this)}
                />
              </div>
              <div className="form-control">
                <input type="submit" />
              </div>
            </form>
          </div>
        </div>
      </Page>
    );
  }
```

Super simple.

Here's what the finished product looks like:



This will obviously need some expansion with error messages and not using prompts for our responses, but I'll do that in the background.

## Creating a dashboard

For our dashboard page, we're going to keep with the theme of keeping our site super simple, the basis of this is a bit of code that will redirect the user to the login page if they haven't logged in, reusing the same component that we made earlier:

It then sets the state for the user details so we can use that later.

```javascript
  componentDidMount() {
    const { user, loggedIn } = checkLoggedIn();
    if (!loggedIn) {
      redirect({}, "/login");
    } else if (user) {
      this.setState({ user: user });
    } else {
      redirect({}, "/login");
    }
  }
```

We can then grab those user details with a bit of code like the following:

```html
<p>
  <strong>User Data:</strong>
</p>
<p>Sub: {this.state.user.idToken.payload.sub}</p>
<p>Email: {this.state.user.idToken.payload.email}</p>
<p>
  <strong>Token:</strong>
</p>
<pre>{this.state.user.idToken.jwtToken}</pre>
```

## Adding authentication to our API

On the Express side of this, we need a couple of packages, which can be imported like the following:

```javascript
const bearerToken = require('express-bearer-token');
const CognitoExpress = require('cognito-express');
```

bearerToken will allow us to grab the bearer token from the request, and cognitoExpress is our link to AWS Cognito from our Express API.

We use this like the following to validate the requests bearer token.

You set it up like so:

```javascript
const cognitoExpress = new CognitoExpress({
  region: 'eu-west-2',
  cognitoUserPoolId: config.AUTH.UserPoolId,
  tokenUse: 'id',
});
```

And then use if like so:

```javascript
server.post(`/api/content`, async function (req, res) {
  if (req.token) {
    cognitoExpress.validate(req.token, async function (err, response) {
      if (err || !response) {
        res.status(403).json({ error: 'Token invalid' });
      } else {
        res.status(200).json({ response });
      }
    });
  } else {
    res.status(403).json({ error: 'Token invalid' });
  }
});
```

## And that's about it

For now, this should be good enough for securing our pages and APIs, keeping the bad guys out.

Making sure the bad guys have the wrong tools
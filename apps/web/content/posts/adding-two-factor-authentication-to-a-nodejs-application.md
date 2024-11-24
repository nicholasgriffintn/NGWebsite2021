---
title: "Adding two-factor authentication to a NodeJS application"
description: "Increase the security of your service in less than an hour"
date: "2020-05-08T15:48"
archived: true
---

**Two-factor authentication is actually really simple.**

That's not a sentence that you'll hear a lot in the industry, but all the same, it's one that is most definitely true.

If you are looking to secure the data in your application, there's no reason why you can't add two-factor authentication to your app in less than an hour. We're using NodeJS, but it's my firm belief that this is the same for pretty much any application out there.

If you've already got the hard work down in terms of securing your user data and passwords, it shouldn't be too much more to extend that to two-factor secrets.

## Some pre-requisites

For this post, we're going to be talking about implementing two-factor into a NodeJS application, and more specifically, with Express.

We are also going to be using the ORM Sequelize, I'm expecting that you already have these setup or already have alternatives. This is the same for our frontend with is React, NextJS.

## Modules that we'll be using

In order to make this even easier, we are going to be using a couple of packages, SpeakEasy and QRCode.React, you can install these in your application with npm or yarn, whichever you prefer, and then import them like so:

For SpeakEasy on Express:

```javascript
const speakeasy = require("speakeasy");
```

For QRCode.React in React:

```javascript
import QRCode from "qrcode.react";
```

## Generating a secret and storing it in Express

In order for a user to validate a two-factor authentication code, they are going to need a secret generating against their user data within your system.

For this, we will create a quick Express API that validates the user, generates the secret, and responds with the secret itself and a URL safe secret like so:

(I'm using Cognito and yes I know that has two-factor, I'm doing this for fun 😊 )

```javascript
server.post(`/api/admin/two-factor`, async function (req, res) {
    if (req.token) {
      cognitoExpress.validate(req.token, async function (err, response) {
        if (err || !response) {
          res.status(403).json({ error: "Token invalid" });
        } else {
          // Our further code here
       }
   }
})
```

From there, we need to add our generating code, which consists of three values, the first is the base secret, the second is the secret that we'll be storing in our db to validate against, and the third is the secret URL which we'll pass to the front-end for our QR code.

```javascript
const genSecret = speakeasy.generateSecret();

const genSecretBase = genSecret.base32;

const genSecretURL = genSecret.otpauth_url;
```

Then we just need to store the token in the db and respond:

```javascript
await models.user.update(
  {
    two_factor_secret: genSecretBase,
  },
  { where: { id: response.sub } }
);

res.status(200).json({ secret: genSecretBase, secretURL: genSecretURL });
```

## Adding the QR code generation screen

The front-end for code generation is really simple, we're just going to have a button that generates the token and then displays the code for the user to scan.

This is all of the code for our React page:

```javascript
import React from "react";
import checkLoggedIn from "../lib/checkLoggedIn";
import redirect from "../lib/redirect";

import Page from "../components/Page";

import QRCode from "qrcode.react";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      title: "",
      description: "",
      tags: "",
      thumbnail: "",
      header: "",
      content: "",
      qrcode_secret_url: null,
    };
  }

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

  generateTwoFactorCode() {
    if (this.state.user && this.state.user.idToken.jwtToken) {
      var grabTwoFactorSecretHeaders = new Headers();
      grabTwoFactorSecretHeaders.append(
        "Authorization",
        "Bearer " + this.state.user.idToken.jwtToken
      );
      grabTwoFactorSecretHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: "POST",
        headers: grabTwoFactorSecretHeaders,
        redirect: "follow",
      };

      fetch("/api/admin/two-factor", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          result = JSON.parse(result);
          this.setState({ qrcode_secret_url: result.secretURL });
        })
        .catch((error) => console.error("error", error));
    }
  }

  render() {
    return (
      <Page displayHeader={true} title="Dashboard">
        <div className="content-wrap">
          <div className="container-main">
            <div className="page-header-spacer"></div>

            <h1>Setup Two Factor Authentication</h1>

            {this.state.user && this.state.user.idToken ? (
              <React.Fragment>
                <button
                  className="btn btn-primary"
                  onClick={() => this.generateTwoFactorCode()}
                >
                  Generate Code
                </button>
                {this.state.qrcode_secret_url && (
                  <div className="qrcode-wrap">
                    <QRCode value={this.state.qrcode_secret_url} />
                  </div>
                )}
              </React.Fragment>
            ) : (
              <p>Loading data</p>
            )}
          </div>
        </div>
      </Page>
    );
  }
}
```

It should look something like this:



## Creating an API for verifying two-factor codes

Now that we have the secret generation API and front-end, we need another API for verifying a code that has been inputted by the user and activating a user for two-factor authentication, alongside some new front-end.

In the same way as the generate route, we will need a new route for the verification on Express, this time I'm calling it 'verify-two-factor'.

Within this API, we just need to grab the user's secret in the db and use it to verify the timed two-factor code that they've inputted against that token.

Speakeasy makes this really simple, the code is:

```javascript
const userData = await models.user.findByPk(response.sub);
if (userData) {
  const userSecret = userData.two_factor_secret;

  const userVerfied = speakeasy.totp.verify({
    secret: userSecret,
    encoding: "base32",
    token: req.body.twofactor,
  });

  if (userVerfied) {
    await models.user.update(
      {
        two_factor_enabled: true,
      },
      { where: { id: response.sub } }
    );

    res.status(200).json({ status: "Verified" });
  } else {
    res.status(500).json({ error: "User not verified", status: "Unverified" });
  }
} else {
  res.status(500).json({ error: "User not found" });
}
```

Super simple right?

You can use this API to ensure that your user has inputted a two-factor code before allowing them access to any of their details, for this post, I've done a simple bit of code that calls the API on form submission.



```javascript
import React from "react";
import checkLoggedIn from "../lib/checkLoggedIn";
import redirect from "../lib/redirect";

import Page from "../components/Page";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      twofactor: null,
    };
  }

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

  handleTwoFactorChange(e) {
    this.setState({ twofactor: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    var verifyTwoFactorHeaders = new Headers();
    verifyTwoFactorHeaders.append(
      "Authorization",
      "Bearer " + this.state.user.idToken.jwtToken
    );
    verifyTwoFactorHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      twofactor: this.state.twofactor,
    });

    var requestOptions = {
      method: "POST",
      headers: verifyTwoFactorHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("/api/admin/verify-two-factor", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        this.setState({ qrcode_secret_url: result.secretURL });
      })
      .catch((error) => console.error("error", error));
  }

  render() {
    return (
      <Page displayHeader={true} title="Dashboard">
        <div className="content-wrap">
          <div className="container-main">
            <div className="page-header-spacer"></div>

            <h1>Verify Two Factor Authentication</h1>

            {this.state.user && this.state.user.idToken ? (
              <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-control">
                  <input
                    type="twofactor"
                    value={this.state.twofactor}
                    placeholder="Two Factor Code"
                    onChange={this.handleTwoFactorChange.bind(this)}
                  />
                </div>
                <div className="form-control">
                  <input type="submit" />
                </div>
              </form>
            ) : (
              <p>Loading data</p>
            )}
          </div>
        </div>
      </Page>
    );
  }
}
```

And that really is it, the rest is up to you to integrate and play around with.

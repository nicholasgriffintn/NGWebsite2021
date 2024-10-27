---
title: "Project NG 2020: Adding a dashboard to my site"
description: "It's time to expand Project NG 2020 with a new dashboard for publishing and editing content"
date: "Monday, April 20 2020 3:48 pm"
archived: true
---

So far in Project NG 2020, I have published a number of posts about the launch of my new website for 2020, which is a NextJS website and blog that's backed by Express and Postgres.

We've adding authentication via AWS Cognito, launched a new website and blog with NextJS and got started with a few new APIs like my new image resizing API.

Today, I'm going to talk about how I added my own posting dashboard for publishing and editing my content, without the need of using a third-party CMS, the main goal being to make sure that this site has no requirements on anything else.

Let's get started.

## Creating our Express API

Before we started, we're going to need to set up an Express API that will take care of the publishing and editing of the content, the code for this API is below.

```javascript
server.post(`/api/admin/content`, limiter, async function (req, res) {
  if (req.token) {
    cognitoExpress.validate(req.token, async function (err, response) {
      if (err || !response) {
        res.status(403).json({ error: "Token invalid" });
      } else {
        req.apicacheGroup = "content-api";

        try {
          if (
            req.body &&
            req.body.slug &&
            req.body.title &&
            req.body.description &&
            req.body.tags &&
            req.body.thumbnail &&
            req.body.header &&
            req.body.content
          ) {
            const postData = await models.article.findByPk(req.body.slug);
            if (postData) {
              const record = await models.article.update(
                {
                  id: req.body.slug,
                  title: req.body.title,
                  published: req.body.published || false,
                  description: req.body.description,
                  tags: req.body.tags,
                  thumbnail: req.body.thumbnail,
                  header: req.body.header,
                  content: req.body.content,
                },
                { where: { id: req.body.slug } }
              );

              await redis.del(`model:article:${req.body.slug}`);

              res.status(200).json({ record });
            } else {
              const record = await models.article.create({
                id: req.body.slug,
                title: req.body.title,
                published: req.body.published || false,
                description: req.body.description,
                tags: req.body.tags,
                thumbnail: req.body.thumbnail,
                header: req.body.header,
                content: req.body.content,
              });
              res.status(200).json({ record });
            }
          } else {
            res.status(500).json({ error: "Incorrect params" });
          }
        } catch (error) {
          res.status(500).json({ error: error });
        }
      }
    });
  } else {
    res.status(403).json({ error: "Token invalid" });
  }
});
```


It might look like a lot of code, but it's quite simple.

Basically, my blog has the following fields in the modal:

* id
* slug
* title
* description
* tags
* thumbnail
* header
* content


Within this API, we're simply checking for all of these fields and then storing the data in our articles modal.

We also have a check here to see if the slug already exists as a post in our DB, if it does we are going to update the record, if it doesn't we're creating it.

When we're done, we will respond with the content.

In the future, I want to update this so that alongside the DB a markdown file is also stored on the server as a form of a backup.

## Creating our dashboard page

For our dashboard page, I've decided to keep things simple with a React Component rather than a Functional Component.

**Setting the state**

To start, on our page, we need to set up the state for all of the fields that we want to save as mentioned above.

```javascript
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
      postData: {},
      id: "",
      isEditing: false,
    };
  }
```

Next up is a componentDidMount function that will check if the user is logged in an set the state for the user.

We also have a check here for the prop postData, which we will set further down the page as a prop.

We'll then use the data from that to set the state for all of the params as well as the isEditing state.

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

    if (this.props.postData && this.props.postData.article) {
      this.setState({
        isEditing: true,
        title: this.props.postData.article.title || "",
        description: this.props.postData.article.description || "",
        content: this.props.postData.article.content || "",
        header: this.props.postData.article.header || "",
        thumbnail: this.props.postData.article.thumbnail || "",
        tags: this.props.postData.article.tags || "",
        id: this.props.postData.article.id || "",
      });
    }
  }
```

This will allow us to publish content as well as update it.

As I'm using NextJS, I can set the props for the postData with a function called getInitialProps, like so:

```javascript
Dashboard.getInitialProps = async (context) => {
  let error = false;
  let loading = true;
  let postData = {};

  if (context.query && context.query.article) {
    console.log(context.query.article);

    return fetch(config.websiteUrl + "/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "GetArticle",
        variables: { id: context.query.article },
        query: `query GetArticle {
        article(id: "${context.query.article}") {
          id
          title
          content
          description
          tags
          thumbnail
          header
          createdAt
          updatedAt
        }
      }`,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((responseAsJson) => {
        loading = false;

        // Pass data to the page via props
        return { postData: responseAsJson.data };
      })
      .catch((e) => {
        console.error("error generating server side code");
        console.error(e);
        return { postData: { message: "No article id found" } };
      });
  } else {
    error = {
      message: "No article id found",
    };
    loading = false;
    return { postData: { message: "No article id found" } };
  }
};
```

This is looking for the query parameter ?article=, it's then pinging my GraphQL for retrieving content from an ID, you could make this a REST request quite easily as well.

Once the content has been retrieved, the data is passed to the page via props.

Now we're ready to get started with the html code, which I've on a similar level of simplicity.

Here's the initial code:

```javascript
{
  this.state.isEditing && this.props.postData && this.props.postData.article ? (
    <h2>Edit the post: {this.props.postData.article.title}</h2>
  ) : (
    <h2>Create a post</h2>
  );
}

<PostForm
  isEditing={this.state.isEditing}
  id={this.state.id}
  title={this.state.title}
  description={this.state.description}
  tags={this.state.tags}
  thumbnail={this.state.thumbnail}
  header={this.state.header}
  content={this.state.content}
  onTitleChange={this._handleChangeTitle}
  onDescriptionChange={this._handleChangeDescription}
  onTagsChange={this._handleChangeTags}
  onThumbnailChange={this._handleChangeThumbnail}
  onHeaderChange={this._handleChangeHeader}
  onContentChange={this._handleChangeContent}
/>;

```

Basically, this just shows a different title depending on if you are editing a post or not, and then it loads the PostForm component, which is the actual form for the editing and publishing.

We pass a bunch of props from this page to the component, which is basically just the state data and the on change events, which basically pass the inputs value back and then sets the state.

Here's the code for the PostForm component:

```javascript
import React from "react";

const ReactMarkdown = require("react-markdown");

import ReactMde from "react-mde";
import "react-mde/lib/styles/css/react-mde-all.css";

export default class PostForm extends React.Component {
  render() {
    return (
      <div style={this.props.style}>
        {this.props.id && (
          <div className="form-control">
            <span>ID: {this.props.id}</span>
          </div>
        )}
        <div className="form-control">
          <label className="form-control">Title</label>
          <input
            autoComplete="off"
            style={{ marginBottom: 24 }}
            placeholder="Post Title"
            onChange={this.props.onTitleChange}
            value={this.props.title}
          />
        </div>
        <div className="form-control">
          <label className="form-control">Description</label>
          <textarea
            autoComplete="off"
            style={{ marginBottom: 24 }}
            placeholder="Post Description"
            onChange={this.props.onDescriptionChange}
            value={this.props.description}
          />
        </div>
        <div className="form-control">
          <label className="form-control">Tags</label>
          <input
            autoComplete="off"
            style={{ marginBottom: 24 }}
            placeholder="Post Tags"
            onChange={this.props.onTagsChange}
            value={this.props.tags}
          />
        </div>
        <div className="form-control">
          <label className="form-control">Thumbnail</label>
          <input
            autoComplete="off"
            style={{ marginBottom: 24 }}
            placeholder="Post Thumbnail"
            onChange={this.props.onThumbnailChange}
            value={this.props.thumbnail}
          />
        </div>
        <div className="form-control">
          <label className="form-control">Header</label>
          <input
            autoComplete="off"
            style={{ marginBottom: 24 }}
            placeholder="Post Header"
            onChange={this.props.onHeaderChange}
            value={this.props.header}
          />
        </div>
        <div className="form-control post-editor markdown-editor">
          <label className="form-control">Post Content</label>
          <ReactMde
            value={this.props.content}
            onChange={this.props.onContentChange}
          />
          <div id="post-content" className="preview">
            <ReactMarkdown source={this.props.content} />
          </div>
        </div>
      </div>
    );
  }
}
```

As you can see at the bottom, I'm using markdown for my post content. At the bottom, there's a markdown editor, which I'm using a component called react-mde for. Next to that, I've added a preview of the post via the react-markdown plugin.

This makes it super easy to write content as markdowns really simple to edit with and it's great to see a preview as you write it, especially since it's using the final styles.

When this form is submitted, the function that was passed in the props will run, which is:

```javascript
_handleSave = () => {
  if (
    this.state &&
    this.state.user &&
    this.state.user.idToken &&
    this.state.user.idToken.jwtToken
  ) {
    if (
      this.state.title &&
      this.state.description &&
      this.state.tags &&
      this.state.thumbnail &&
      this.state.header &&
      this.state.content
    ) {
      var headers = new Headers();
      headers.append(
        "Authorization",
        "Bearer " + this.state.user.idToken.jwtToken
      );
      headers.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        slug: this._slugify(this.state.title),
        title: this.state.title,
        published: true,
        description: this.state.description,
        tags: this.state.tags,
        thumbnail: this.state.thumbnail,
        header: this.state.header,
        content: this.state.content,
      });

      var requestOptions = {
        method: "POST",
        headers: headers,
        body: raw,
        redirect: "follow",
      };

      fetch("/api/admin/content", requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result))
        .catch((error) => console.log("error", error));
    } else {
      console.error("incorrect params");
    }
  } else {
    redirect({}, "/login");
  }
};
```

This basically pushes the state function to the Express API that we defined at the start.

You can [find the full code for this and the rest of my site here](https://github.com/nicholasgriffintn/NGWebsite2020).

We're now ready to get started on creating tons of content for the rest of 2020.

![](https://media.giphy.com/media/13GIgrGdslD9oQ/giphy.gif&w=3840&q=80)

/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost($owner: String) {
    onCreatePost(owner: $owner) {
      id
      title
      description
      status
      tags {
        name
      }
      thumbnail
      header
      ctime
      content
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost($owner: String) {
    onUpdatePost(owner: $owner) {
      id
      title
      description
      status
      tags {
        name
      }
      thumbnail
      header
      ctime
      content
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost($owner: String) {
    onDeletePost(owner: $owner) {
      id
      title
      description
      status
      tags {
        name
      }
      thumbnail
      header
      ctime
      content
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      owner
      comments {
        items {
          id
          postID
          content
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
          owner
        }
        nextToken
        startedAt
      }
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment($owner: String) {
    onCreateComment(owner: $owner) {
      id
      postID
      content
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      post {
        id
        title
        description
        status
        tags {
          name
        }
        thumbnail
        header
        ctime
        content
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        comments {
          nextToken
          startedAt
        }
      }
      owner
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment($owner: String) {
    onUpdateComment(owner: $owner) {
      id
      postID
      content
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      post {
        id
        title
        description
        status
        tags {
          name
        }
        thumbnail
        header
        ctime
        content
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        comments {
          nextToken
          startedAt
        }
      }
      owner
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment($owner: String) {
    onDeleteComment(owner: $owner) {
      id
      postID
      content
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
      post {
        id
        title
        description
        status
        tags {
          name
        }
        thumbnail
        header
        ctime
        content
        createdAt
        updatedAt
        _version
        _deleted
        _lastChangedAt
        owner
        comments {
          nextToken
          startedAt
        }
      }
      owner
    }
  }
`;

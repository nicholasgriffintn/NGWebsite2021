---
title: React 19 is now stable
date: "2024-12-05T20:37"
description: Earlier today, React 19 was released as a stable version.\n\nReact devs have been waiting on this release for a while and for good reason, it brings a bunch of new features and improvements.\n\nHere are some of the highlights:
tags: [react, react-19]
image: /uploads/react-19-stable/featured.png
imageAlt: A screenshot of the React 19 release notes
hideFeaturedImage: true
---

## Server Components

One of the major additions in React 19 is the introduction of React Server Components, which allows you to render components ahead of time, on the server (or your dev machine).

This brings a number of advantages such as better SEO, better performance and the ability to execute code directly on the server, related to your components such as API calls or database queries.

Next is currently the largest framework to implement these, [they have some documentation here](https://nextjs.org/docs/app/building-your-application/rendering/server-components).

Kent C Dodds has also published a great tutorial here: https://react-server-components.epicweb.dev/, and you can find out more in the [React Server Components docs](https://react.dev/reference/rsc/server-components).

### Server Actions

Server Actions allow "Client Components" to call async functions from the client that are then executed on the server.

You define them with a `"use server"` directive, like this:

```ts
"use server"

const submitData = async (userData) => {
    const newUser = {
        username: userData.get('username'),
        email: userData.get('email')
    }
    console.log(newUser)
}
```

These are then pass as props to Client Components, or imported.

```tsx
const Form = () => {
    return <form action={submitData}>
        <div>
            <label>Name</label>
            <input type="text" name='username'/>
        </div>
        <div>
            <label>Name</label>
            <input type="text" name="email" />
        </div>
        <button type='submit'>Submit</button>
    </form>
}

export default Form;
```

More information can be found out [about this here](https://react.dev/reference/rsc/server-actions).

## Metadata

React 19 also removes the need to use packages like react-helmet and now you can define tags like `title` and `meta` directly inside of components and then they would be applied to the document’s head, this also removes the need to use any state or even, the `useEffect` hook to update them.

This removes the need for libraries like react-helmet and makes it easier to manage metadata for your application.

More information can be found at these places: [link](https://react.dev/reference/react-dom/components/link), [meta](https://react.dev/reference/react-dom/components/meta), [script](https://react.dev/reference/react-dom/components/script), [style](https://react.dev/reference/react-dom/components/style), and [title](https://react.dev/reference/react-dom/components/title).


## Asset Loading

React 19 adds the ability to load images and other files in the background naturally, without the need for additional components or code.

Alongside this, it introduces a new version of Suspense for dynamically loading assets such as scripts, stylesheets and fonts. Suspense will also automatically determine when the content is ready to displayed, so it will be loaded as soon as it is needed.

React has also added new `preload` and `preinit` APIs to provide control over this.

Here's an example from the docs:

```tsx
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```

More details about this [can also be found here](https://react.dev/reference/react-dom#resource-preloading-apis).

## Use

React 19 introduces the `use` hook which can be used alongside promises, async code and context without the need for `useEffect` or `useState`.

An example of this in action:

```tsx
import { use } from "react";

const fetchUsers = async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/users');
    return res.json();
  };
  
  const UsersItems = () => {
    const users = use(fetchUsers());
  
    return (
      <ul>
        {users.map((user) => (
          <div key={user.id} className='bg-blue-50 shadow-md p-4 my-6 rounded-lg'>
            <h2 className='text-xl font-bold'>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        ))}
      </ul>
    );
  }; 
export default UsersItems;
```

It can also be used in a similar way with context.

More information can be [found here](https://react.dev/reference/react/use).

## useFormStatus()

Alongside the new `use` hook, React 19 has a new `useFormStatus` API that provides control for forms via `pending`, `data`, `method` and `action` methods/ state.

This is similar to react-hook-form, but in React directly and intended to work with actions.

Here’s an example:

```tsx
import { useFormStatus } from "react-dom";
    
function Submit() {
  const status = useFormStatus();
  return <button disabled={status.pending}>{status.pending ? 'Submitting...' : 'Submit'}</button>;
}

const formAction = async () => {
  // Simulate a delay of 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 3000));
}

const FormStatus = () => {
  return (
    <form action={formAction}>
      <Submit />
    </form>
  );
};

export default FormStatus;
```

More information can be [found here](https://react.dev/reference/react-dom/hooks/useFormStatus#use-form-status).


## useOptimistic()

The new `useOptimistic` hook allows you to show a different state while an async action is occuring, this allows you to optimistically load content for an immediate response while something like an API is processing.

Here’s an example:

```tsx
import { useOptimistic, useState } from "react";

const Optimistic = () => {
  const [messages, setMessages] = useState([
    { text: "Hey, I am initial!", sending: false, key: 1 },
  ]);
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [
      ...state,
      {
        text: newMessage,
        sending: true,
      },
    ]
  );

  async function sendFormData(formData) {
    const sentMessage = await fakeDelayAction(formData.get("message"));
    setMessages((messages) => [...messages, { text: sentMessage }]);
  }

  async function fakeDelayAction(message) {
    await new Promise((res) => setTimeout(res, 1000));
    return message;
  }

  const submitData = async (userData) => {
    addOptimisticMessage(userData.get("username"));

    await sendFormData(userData);
  };

  return (
    <>
      {optimisticMessages.map((message, index) => (
        <div key={index}>
          {message.text}
          {!!message.sending && <small> (Sending...)</small>}
        </div>
      ))}
      <form action={submitData}>
        <h1>OptimisticState Hook</h1>
        <div>
          <label>Username</label>
          <input type="text" name="username" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Optimistic;
```

More information can be [found here](https://react.dev/reference/react/useOptimistic).


## You no longer need `forwardRef`

With React 18, you can now access ref as a prop for function components, which means you no longer need `forwardRef`.

React has also created a [codemod](https://react.dev/blog/2024/04/25/react-19-upgrade-guide#codemods) that will automatically update your code to remove the need for `forwardRef`.

## Upgrading

And that's the things I felt like pointing out, you can read the full release notes [here](https://react.dev/blog/2024/12/05/react-19).

You can also find the [Upgrade Guide here](https://react.dev/blog/2024/04/25/react-19-upgrade-guide).
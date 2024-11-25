---
title: "Adding Service Worker to my site"
description: "Whoops! I forgot to add Service Worker to my site. Probably about time to do that..."
date: "2019-05-19T15:48"
archived: true
tags: [javascript, serviceworker, pwa]
---

Service Workers have been around for quite a  while now and are awesome little JavaScript that can change the value that your site provides from behind something tethered to a mobile connection to a fully fledged progressive web app, ready for consumption on the mobile web, wherever your users are.

I remember being one of the first people I saw integrating them on sites back when I was  managing my technology blog, TechNNutty, allowing me to dramatically reduce the loading  time of that site without having the spend more money than I had to, for that reason alone, Service Workers are a no brainer for any website, top that with the ability to save content for offline consumption, send push notifications and more and you have the solution for modern websites, without any integration mess.

So if you haven't already, I would definitely advice following through this and getting set up with your own Service Worker set up.

## Before we begin

Before you  start building a Service Worker, you should definitely read up on the topic from various sources, they'll know and explain it a lot better than me. [Google has some great articles and posts about all things Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers/).

You should also note that Service Worker is bound to a particular scope, that means it can only be installed and can only control a singular domain, usually your main root domain so you may want to think about your application structure before getting placing code.

That last part also means that you need access to your websites, root directory. You also cannot host a Service Worker on a CDN.

That's still not all.

You also need to be using HTTPS across your site (You will be able to load it on localhost on Chrome for dev) and you should note that Service Worker is currently only supported on selected browsers Jake Archibald's [is Serviceworker ready site](https://jakearchibald.github.io/isserviceworkerready/) is a great place to check the status of support for various Service Worker related features.

## Getting your app to register a Service Worker

Thanks to the browser's implementation of the Service Worker spec, it's actually really easy to get started and  register a Service Worker, so before we actually create any code, that will be the first part that we will complete.

Here's the code that I'm using on  this  site:

```javascript
window.addEventListener("DOMContentLoaded", function (event) {
    // Load the service worker         
    if ('serviceWorker' in navigator) { 
        navigator.serviceWorker.register('/serviceworker.js', { scope: '/'})            .then( function( registration) {
                console.log(`Service Worker successfully registered for`, registration.scope);
            })
            .catch( function( error ) {
                console.log(`ServiceWorker not registered: ${error}`);
            });
        if(navigator.serviceWorker.controller) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.controller.postMessage({'command': 'trimCaches'});
            })
        }
    }
});
```

Basically, this waits for the DOM to lo load, checks for Service Worker support and then installs SW if it is supported.

The part that actually installs the script is the following line:

```javascript
navigator.serviceWorker.register('/serviceworker.js', { scope: '/'});
```

This basically says what the path to the file is and the scope that Service Worker should use.

As you can see, this also use promises, so you can also throw in some validation checking and reporting.

I've also added a postMessage for trimming the cache, which we will get to later.

## Installing your Service Worker

Now it is time to get started on the creation of your Service Worker file, for this I am naming my file 'serviceworker.js' but you can call it whatever you like.

At the start of the file, you should add some global variables to make your life easier further down the line. My globals look like this:

```javascript
// The names for our caches and the version number 
    const version = "-v1.0.5"; 
    const staticCache = "cachedFiles" + version; 
    const pagesCache = "cachedPages"; 
    const imagesCache = "cachedImages"; 
    const cacheList = [staticCache, pagesCache, imagesCache];  
    // Our list of paths to cache on install 
    const pagesToCache = ["/", "/offline"];  
    // Static files to cache on install 
    const staticsToCache = [   "static/js/typed.min.js",   "static/js/nghpjs.js",   "static/js/lazyload.min.js" ];
```

They are all pretty self-explanatory, but what I am basically doing here is naming our caches and setting what files should be cached on install. If you are creating an offline-ready PWA, you should include an offline page here as well that displays some sort of message to your offline users.

Mine's pretty simplistic.

I also added the following function that stores the  files so I don't have to repeat myself a lot:

```javascript
    // The names for our caches and the version number 
    const version = "-v1.0.5"; 
    const staticCache = "cachedFiles" + version; 
    const pagesCache = "cachedPages"; 
    const imagesCache = "cachedImages"; 
    const cacheList = [staticCache, pagesCache, imagesCache];  
    // Our list of paths to cache on install 
    const pagesToCache = ["/", "/offline"];  
    // Static files to cache on install 
    const staticsToCache = [   "static/js/typed.min.js",   "static/js/nghpjs.js",   "static/js/lazyload.min.js" ];
```

From here, the install event is as easy as the following:

```javascript
    // Install event will trigger when first initated 
    addEventListener("install", installEvent => {   skipWaiting();   
        // tell the browser to delay the SW installation until cache is populated   
        installEvent.waitUntil(     
            // now populate the cache (cache the files) using the Cache API     
            // 1\. Open the cache     
            caches.open(staticCache).then(staticCache => {       
                // Cache pages       
                caches.open(pagesCache).then(pagesCache => {         
                    pagesCache.addAll(pagesToCache);       
                });        
                return staticCache.addAll(staticsToCache);     
            })   
        ); 
    });
```

This simply listens for the install event and then adds all of the base files to our cache.

The 'skipWaiting()' callback is optional here, it basically forces the waiting service worker to become the active service worker right away.

Caching and returning requests from Service Worker
As Service Worker pretty much controls your network requests, you'll also need to set up a fetch event, this will tell Service  Worker what to cache and how to respond to requests.

You can do this as simply as the following:

```javascript
    self.addEventListener('fetch', function(event) {   
        event.respondWith(     
            caches.match(event.request)       
            .then(function(response) {         
                // Cache hit - return response         
                if (response) {           
                    return response;         
                }          
                return fetch(event.request).then(           
                    function(response) {             
                        // Check if we received a valid response             
                        if(!response || response.status !== 200 || response.type !== 'basic') {               
                            return response;             
                        }              
                        // IMPORTANT: Clone the response. A response is a stream      // and because we want the browser to consume the response    // as well as the cache consuming the response, we need       // to clone it so we have two streams.             
                        var responseToCache = response.clone();              caches.open(CACHE_NAME)               
                        .then(function(cache) {                 
                            cache.put(event.request, responseToCache);               
                        });              
                        return response;           
                    }         
                );       
            })     
        ); 
    });
```

That example is from Google's post, for my own site, I  took things a little further than that as I wanted to separate caches and how they were handled.

```javascript
    // trigger this event when a path is requested 
    addEventListener("fetch", fetchEvent => {   
        const request = fetchEvent.request;    
        // Check if the request URL is from us, otherwise ignore it   
        if (     request.url.indexOf("https://nicholasgriffin.dev") ||     request.url.indexOf("http://localhost:8080")   ) {
```

To start, I added an indexOf to check if the requested  URL was from my own domain, as I don't want to cache other resources (this can break your site pretty easily), later down the line, I could expand this to add third-party caching for resources that I know work with Service Worker, like my CDN for example, for know I am simply ignoring other domains.

I then split my  caching into three sections.

### HTML Resources

```javascript
    if (request.headers.get("Accept").includes("text/html")) {       
        // respons with this if a page       
        fetchEvent.respondWith(         
            fetch(request)           
            .then(responseFromFetch => {             
                const copy = responseFromFetch.clone();              
                fetchEvent.waitUntil(               
                    caches.open(pagesCache).then(pagesCache => {                 
                        pagesCache.put(request, copy);               
                    })             
                );              
                return responseFromFetch;           
            })           
            // If the response errors           
            .catch(error => {             
                return caches.match(request).then(responseFromCache => {
                    if (responseFromCache) {                 
                        return responseFromCache;               
                    }                
                    // serve offlie page               
                    return caches.match("/offline");             
                });           
            })       
        );        
        return;     
    }
```

### Image Resources

```javascript
    // Check if the request is for an image     
    if (request.headers.get("Accept").includes("image")) {       
        fetchEvent.respondWith(         
            caches.match(request).then(responseFromCache => {           
                // If the image is already in the cache, return it           
                if (responseFromCache) {             
                    fetchEvent.waitUntil(stashInCache(request, imagesCache));
                    return responseFromCache;           
                } else {             
                    return (               
                        fetch(request)                 
                        .then(responseFromFetch => {                   
                            const copy = responseFromFetch.clone();
                            fetchEvent.waitUntil(                     
                                caches.open(imagesCache).then(imageCache => {
                                    imageCache.put(request, copy);
                                })                   
                            );                   
                            return responseFromFetch;                 
                        })                 
                        // If the response errors                 
                        .catch(error => {                   
                            return caches.match("/offline.png");                 
                        })             
                    );           
                }         
            })       
        );        
        return;    
    }
```

### Everything else

```javascript
    // for everything else     
    fetchEvent.respondWith(       
        caches.match(request).then(responseFromCache => {         
            fetchEvent.waitUntil(           
                fetch(request).then(responseFromFetch => {             
                    caches.open(pagesCache).then(pagesCache => {               
                        return pagesCache.put(request, responseFromFetch);
                    });           
                })         
            );         
            return responseFromCache;       
        })     
    );
```

And from that point, you'll have a pretty mean Service Worker. But there is a bit more that  you can do.

## Updating the Service Worker

One pretty important task is to add an 'activate' event listener. This is important as it will allow you to clear out any old cache files.

I'm doing that will the following:

```javascript
window.addEventListener("activate", activateEvent => {
  activateEvent.waitUntil(
    // Clean up caches and clear old ones on activate
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (!cacheList.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return clients.claim();
      })
  );
});
```

I also have the following function for trimming the cache on every page load so that it doesn't load to much on my user's machines.

This is done with  the following via the PostMessage that I mentioned earlier, limiting the pagesCache and imagesCache to 30:

```javascript
function trimCache(cacheName, maxItems) {
  caches.open(cacheName).then(cache => {
    cache.keys().then(keys => {
      if (keys.length > maxItems) {
        cache.delete(keys[0]).then(trimCache(cacheName, maxItems));
      }
    });
  });
}
```

I don't include the staticCache in this as I pretty much always want those resources cached.

## And that's it

Pretty easy right?

If you'd like to see my complete code and don't fancy taking a look through Developer Tools, [I've uploaded it to my Github here](https://github.com/nicholasgriffintn/NG_Website_SW).

When even a tractor can be fast, your site should be, no question.

![Gotta go fast](https://media.giphy.com/media/pZEwBYdHdN2s8/giphy.gif&w=1920&q=80)
# Cache Request

## What is this?
It's just a class for caching responses from ajax. This does **NOT** allow a full offline operation. You should use this for other purposes like:

- Respond quickly to user on some information that doesn't have to be realtime;
- Give a valid, but not so new, information when device is offline;
- Get a valid cached information while wait for real request (*soon*)


## Requiremets
For now, it's depends on jQuery for doing requests and make promises possible.

About requests, it will be improved soon. But for promises some browser needs external libs.

[Promises support](http://caniuse.com/#search=promise)

Sorry about this =(


## How to use?
Just include **cacherequest.min.js** in your html and everything is ready!

So you just have to call **CachedRequestHelper.send()** passing a json as parameter.

This json is the same you already pass to jQuery, but you can pass two more options:

- **cacheTimeout** (integer) (default: 300000. A.K.A.: 5min)
	- time(milliseconds) you want to make you cached information valid.
- **useOldIfError** (bool) (default: false)
	- if an error happened on request, or if there is no connection, a cache can be returned even if it is expired?

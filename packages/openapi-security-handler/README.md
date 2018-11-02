# openapi-security-handler [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> A library to process OpenAPI security definitions in parallel.

## Highlights

* Easily handle security schemes.
* Performant.
* Extensively tested.
* Small footprint.
* Promise based interface.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
import OpenAPISecurityHandler from 'openapi-security-handler';
const handler = new OpenAPISecurityHandler({
  // these are typically taken from the global api doc
  securityDefinitions: {
    keyScheme: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header'
    },
    passwordScheme: {
      type: 'basic'
    }
  },
  // these handle the operation security reference
  securityHandlers: {
    keyScheme: function(req, scopes, securityDefinition) {
      req.user = {name: 'fred'};
      return true; // could also throw or return a Promise.
    },
    passwordScheme: function(req, scopes, securityDefinition) {
      req.user = {name: 'fred'};
      return true;
    }
  },
  // These are typically defined on an operation's openapi document.
  operationSecurity: [
    // we'll execute all the schemes in the object.  If any fail, we'll move to the
    // next object.
    {
      keyScheme: ['write']
    },
    {
      passwordScheme: ['write']
    }
  ],
});
const request = {};
handler.handle(request).then(result => {
  console.log(result); // => true
});
```

## handler.handle
### Return Value

`openapi-security-handler#handle` returns a `Promise`.

* If any of the `securityHandlers` throw an error, the error will be available with `.catch`.
* If all of the `securityHandlers` for the given `operationSecurity` scheme resolve with `true`, then `true` will be resolved.
* If none of the `securityHandlers` resolve with `true` for _all_ of the `operationSecurity` schemes, then a 401 error will be thrown.

## Successful Authentication

Handlers should assign credentials to the request object.

## LICENSE
``````
The MIT License (MIT)

Copyright (c) 2018 Kogo Software LLC

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
``````

[downloads-image]: http://img.shields.io/npm/dm/openapi-security-handler.svg
[npm-url]: https://npmjs.org/package/openapi-security-handler
[npm-image]: http://img.shields.io/npm/v/openapi-security-handler.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: https://api.travis-ci.org/kogosoftwarellc/open-api.svg?branch=master

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=master

[gitter-url]: https://gitter.im/kogosoftwarellc/open-api
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/open-api.png

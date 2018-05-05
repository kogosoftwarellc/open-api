# express-openapi-security [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middleware to handle openapi security.

## Highlights

* Easily handle security schemes.
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (f.k.a. swagger 2.0) security definitions.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var app = require('express')();
var securityDefinitions = {
  keyScheme: {
    type: 'apiKey',
    name: 'api_key',
    in: 'header'
  },
  passwordScheme: {
    type: 'basic'
  }
};
var securityHandlers = {
  keyScheme: function(req, scopes, securityDefinition, cb) {
    req.user = {name: 'fred'};
    cb(null, true);// pass true if validation succeeds, false otherwise.
  },
  passwordScheme: function(req, scopes, securityDefinition, cb) {
    req.user = {name: 'fred'};
    cb(null, true);
  }
};
var operationSecurity = [
  // we'll execute all the schemes in the object.  If any fail, we'll move to the
  // next object.
  {
    keyScheme: ['write']
  },
  {
    passwordScheme: ['write']
  }
];
var security = require('express-openapi-security')(securityDefinition,
    securityHandlers, operationSecurity);

app.get('/something', security, function(req, res) {
  console.log(req.user.name); //=> 'fred'
});
```

## Response

`express-openapi-security` will respond in the following ways:

* `401`
  * This status code is sent if:
    * `cb(null, false)` is called from all `securityHandlers`.
    * `cb({status: 401, challange: 'a challenge string like "Basic"'})` is called
      from at least one of the handlers in the last set of security handlers.
* `403`
  * This status code is sent if:
    * `cb({status: 403, message: 'some message'})` is called
      from at least one of the handlers in the last set of security handlers.
* `500`
  * This status code is sent if:
    * An unknown `status` is passed to `cb`.
    * No security handlers yield `true`.

## Successful Authentication

Upon successful authentication, `next()` is called.

## LICENSE
``````
The MIT License (MIT)

Copyright (c) 2016 Kogo Software LLC

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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi-security.svg
[npm-url]: https://npmjs.org/package/express-openapi-security
[npm-image]: http://img.shields.io/npm/v/express-openapi-security.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/open-api.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/open-api/master.svg

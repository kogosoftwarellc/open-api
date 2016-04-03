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
    cb(true);// pass true if validation succeeds, false otherwise.
  },
  passwordScheme: function(req, scopes, securityDefinition, cb) {
    req.user = {name: 'fred'};
    cb(true);
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

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi-security
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi-security.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi-security
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi-security/master.svg

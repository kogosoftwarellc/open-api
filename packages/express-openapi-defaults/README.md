# express-openapi-defaults [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middelware to set openapi parameter defaults in request properties.

## Highlights

* Effortlessly set default values in header and query request properties.
* Path parameters are not supported because it is assumed they will always have some
value.
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.
* Does not perform type coercion (see [express-openapi-coercion](https://github.com/kogosoftwarellc/express-openapi-coercion)).
* Does not perform validation (see [express-openapi-validation](https://github.com/kogosoftwarellc/express-openapi-validation)).

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var app = require('express')();
var defaults = require('express-openapi-defaults')({
  parameters: [
    {
      in: 'query',
      type: 'integer',
      name: 'foo',
      default: 5
    }
  ]
});

app.get('/something', defaults, function(req, res) {
  // GET /something
  console.log(req.query.foo); //=> 5
});
```

## API

### defaults(args)
#### args.parameters

An array of openapi parameters.

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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi-defaults.svg
[npm-url]: https://npmjs.org/package/express-openapi-defaults
[npm-image]: http://img.shields.io/npm/v/express-openapi-defaults.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi-defaults
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi-defaults.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi-defaults
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi-defaults/master.svg

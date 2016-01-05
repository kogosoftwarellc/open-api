# express-openapi-coercion [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middleware to coerce request properties according to an openapi parameter list.

## Highlights

* Effortlessly coerce header, path, and query request properties to defined types in
an openapi parameters list.
* Handles array types.
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var app = require('express')();
var coerce = require('express-openapi-coercion')({
  parameters: [
    {
      in: 'query',
      type: 'integer',
      name: 'foo',
      required: true
    }
  ]
});

app.get('/something', coerce, function(req, res) {
  // GET /something?foo=5
  console.log(req.query.foo); //=> 5
});
```

## API

### coerce(args)
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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi-coercion.svg
[npm-url]: https://npmjs.org/package/express-openapi-coercion
[npm-image]: http://img.shields.io/npm/v/express-openapi-coercion.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi-coercion
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi-coercion.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi-coercion
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi-coercion/master.svg

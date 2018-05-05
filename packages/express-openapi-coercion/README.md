# express-openapi-coercion [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middleware to coerce request properties according to an openapi parameter list.

## Highlights

* Effortlessly coerce header, path, query and formData request properties to defined types in
an openapi parameters list.
* Handles array types.
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.
* Supports _collectionFormat_ for _formData array_ parameters.

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

## Boolean parameters

By default a boolean parameter is coerced to:
* _false_ if the input value is "false"
* _true_ for any other input value

This behaviour is makes sense if you do not wish to validate the input fields.

If the opposite is the case, the behaviour can be changed by setting the "x-express-openapi-coercion-strict" to _true_ on the parameter in question as illustrated below.

```javascript
var app = require('express')();
var coerce = require('express-openapi-coercion')({
  parameters: [
    {
      in: 'query',
      type: 'boolean',
      name: 'foo',
      required: true,
      "x-express-openapi-coercion-strict": true
    }
  ]
});
```

Doing so will result in the boolean parameter being coerced to:
* _false_ if the input value is "false" (in any casing)
* _true_ if the input value is "true" (in any casing)
* _null_ for any other input value

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

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/open-api.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/open-api/master.svg

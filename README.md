# express-openapi-validation [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middleware for openapi parameter validation.

If validation errors occur, `next` is called with `{status: 400, errors: [<validation errors>]}`.

## Highlights

* Performant.
* Extensively tested.
* Small footprint.
* Does not validate parameter input.  Converts parameter input to jsonschema using [openapi-jsonschema-parameters](https://github.com/kogosoftwarellc/openapi-jsonschema-parameters).
* Leverages [jsonschema](https://www.npmjs.com/package/jsonschema).
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.
* Supports `$ref` in body schemas i.e. `#/definitions/SomeType`.
* Does not handle type conversion (use [express-openapi-defaults](http://github.com/kogosoftwarellc/express-openapi-defaults)).
* Does not supply default values (use [express-openapi-coercion](http://github.com/kogosoftwarellc/express-openapi-coercion)).

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var app = require('express')();
var validate = require('express-openapi-validation')({
  parameters: [
    {
      in: 'query',
      type: 'string',
      name: 'foo',
      required: true
    }
  ],
  schemas: null, // an optional array of jsonschemas used to dereference $ref
  version: 'swagger-2.0', // default optional value for future versions of openapi
  errorTransformer: null // an optional transformer function to format errors
});

app.get('/something', validate, function(req, res) {
  res.status(200).json('woohoo');
});

// GET /something => 400
// GET /something?foo=asdf => 200
```

## API

### validate(args)
#### args.parameters

An array of openapi parameters.

#### args.schemas

An array of schemas.  Each schema must have an `id` property.  See `./test/data-driven/`
for tests with `schemas`.  Ids may be schema local (i.e. `#/definitions/SomeType`),
or URL based (i.e. `/SomeType`).  When supplied, `$ref` usage will map exactly to the
Id e.g. if `id` is `/SomeType`, `$ref` must be `/SomeType`.

#### args.version

An optional string that currently does nothing.  This will ensure nothing breaks
for new versions of openapi drafts that get added in the future.

#### args.errorTransformer

A function that transforms errors.

E.G.

```
  errorTransformer: function(error) {
    return {
      message: error.message
    };
  }
```

See the error format in [jsonschema](https://www.npmjs.com/package/jsonschema).

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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi-validation.svg
[npm-url]: https://npmjs.org/package/express-openapi-validation
[npm-image]: http://img.shields.io/npm/v/express-openapi-validation.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi-validation
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi-validation.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi-validation
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi-validation/master.svg

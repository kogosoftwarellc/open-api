# express-openapi-response-validation [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middleware for openapi response validation.

If validation errors occur, `next` is called with `{status: 404, errors: [<validation errors>]}`.

## Highlights

* Performant.
* Extensively tested.
* Small footprint.
* Leverages [jsonschema](https://www.npmjs.com/package/jsonschema).
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.
* Supports `$ref` in response schemas i.e. `#/definitions/SomeType`.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var app = require('express')();
var validateResponse = require('express-openapi-response-validation')({
  responses: {
    200: {
      description: 'We found what you were looking for.',
      schema: {
        $ref: '#/definitions/ResourceResponse'
      }
    },
    default: {
      description: 'Something happened...',
      schema: {
        $ref: '#/definitions/SomeErrorResponse'
      }
    }
  },
  definitions: {
    ResourceResponse: {
      type: 'object',
      properties: {
        id: {
          type: 'integer'
        },
        name: {
          type: 'string'
        }
      },
      required: ['id', 'name']
    },
    SomeErrorResponse: {
      type: 'object',
      properties: {
        errorCode: {
          type: 'string'
        },
        message: {
          type: 'string'
        }
      }
    }
  }
});

app.get('/something', validate, function(req, res, next) {
  var someResource = {};
  var validation = res.validate(200, someResource);

  if (validation.errors) {
    return next(validation);
  } else {
    res.status(200, someResource);
  }
});
```

## API

TODO

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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi-response-validation.svg
[npm-url]: https://npmjs.org/package/express-openapi-response-validation
[npm-image]: http://img.shields.io/npm/v/express-openapi-response-validation.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi-response-validation
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi-response-validation.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi-response-validation
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi-response-validation/master.svg

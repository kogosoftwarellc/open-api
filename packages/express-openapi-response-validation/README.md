# express-openapi-response-validation [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Express middleware for openapi response validation.

Provides a `.validateResponse` method to express response objects.  If the method
returns a value, it will be a validation error with `status: 500`, a `message`, and
an optional array of `errors`.

## Highlights

* Performant.
* Extensively tested.
* Small footprint.
* Leverages [jsonschema](https://www.npmjs.com/package/jsonschema).
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) responses objects.
* Supports `$ref` in response schemas i.e. `#/definitions/SomeType`.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var app = require('express')();
var validateResponseMiddleware = require('express-openapi-response-validation')({
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

app.get('/something', validateResponseMiddleware, function(req, res, next) {
  var someResource = {};
  var validationError = res.validateResponse(200, someResource);

  /*
    Validation errors look like this (except for objects in the errors array which
    may be overridden with errorTransformer):
    {
      status: 500,
      message: 'The response was not valid.',
      errors: [
        {
          path: 'foo',
          errorCode: 'type.openapi.responseValidation',
          message: 'foo is not of a type(s) string'
        }
      ]
    }
  */

  if (validationError) {
    return next(validationError);
  } else {
    res.status(200, someResource);
  }
});
```

## API

### module(args)

Returns an express middleware function.

#### args

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|Y|N/A|Arguments to configure the middleware.|

#### args.responses

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|Y|N/A|A key value pair of response definitions.  At least one response definition is to be provided.|

Keys may be any HTTP status code or `default` (for all HTTP status codes).  See
http://swagger.io/specification/#responsesObject.

#### args.definitions

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|N/A|A key value pair of type definitions|

This object is used to support `$ref` in your responses

#### args.errorTransformer

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Function|N|toOpenapiValidationError (see the source)|A function that receives an error and returns a mapped version of the error.|

This function is passed 2 arguments.

```
  errorTransformer: function(openapiError, jsonschemaError) {
    return {
      message: openapiError.message
    };
  }
```

See the error format in [jsonschema](https://www.npmjs.com/package/jsonschema) for
`jsonschemaError`.  `openapiError`s have the following properties:

* `errorCode` - A jsonschema error suffixed with `.openapi.validation`.
failed.
* `message` - A detailed message as to why validation failed.
* `path` - The property of the response body that failed validation.

#### args.customFormats

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|An object of custom formats.|

Each key is the name of the format to be used with the `format` keyword.  Each value
is a function that accepts an input and returns a boolean value.

See Custom Formats in [jsonschema](https://github.com/tdegrunt/jsonschema#custom-formats).

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

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/open-api.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/open-api/master.svg

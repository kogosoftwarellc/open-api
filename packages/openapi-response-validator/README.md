# openapi-response-validator [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Validate a response according to an openapi schema.

## Highlights

* Performant.
* Extensively tested.
* Small footprint.
* Leverages [jsonschema](https://www.npmjs.com/package/jsonschema).
* Supports `$ref` in response schemas i.e. `#/definitions/SomeType`.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var OpenAPIResponseValidator = require('openapi-response-validator');
var responseValidator = new OpenAPIResponseValidator({
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

var someResource = {};
var validationError = responseValidator.validateResponse(200, someResource);

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
        message: is not of a type(s) string'
      }
    ]
  }
*/
```

## API

### OpenapiResponseValidator(args)

#### args

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|Y|N/A|Arguments to configure the middleware.|

#### args.loggingKey

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|String|N|''|A prefix to use with constructor errors and logging messages.|

Keys may be any HTTP status code or `default` (for all HTTP status codes).  See
http://swagger.io/specification/#responsesObject.

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
  errorTransformer: function(openapiError, ajvError) {
    return {
      message: openapiError.message
    };
  }
```

See the error format in [ajv](https://www.npmjs.com/package/ajv#validation-errors) for
`ajvError`.  `openapiError`s have the following properties:

* `errorCode` - A jsonschema error suffixed with `.openapi.responseValidation`.
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
```
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
```

[downloads-image]: http://img.shields.io/npm/dm/openapi-response-validator.svg
[npm-url]: https://npmjs.org/package/openapi-response-validator
[npm-image]: http://img.shields.io/npm/v/openapi-response-validator.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: https://api.travis-ci.org/kogosoftwarellc/open-api.svg?branch=master

[coveralls-url]: https://coveralls.io/github/kogosoftwarellc/open-api?branch=main
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=main

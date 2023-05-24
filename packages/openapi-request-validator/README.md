# openapi-request-validator [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Validate request properties against an OpenAPI spec.

## Highlights

* Performant.
* Extensively tested.
* Small footprint.
* Does not validate parameter input.  Converts parameter input to jsonschema using [openapi-jsonschema-parameters](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-jsonschema-parameters).
* Leverages [jsonschema](https://www.npmjs.com/package/jsonschema).
* Supports `$ref` in body schemas i.e. `#/definitions/SomeType`.
* Does not supply default values (use [openapi-default-setter](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-default-setter)).
* Does not handle type coercion (use [openapi-request-coercer](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-coercer)).

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var OpenAPIRequestValidator = require('openapi-request-validator').default;
var requestValidator = new OpenAPIRequestValidator({
  parameters: [
    {
      in: 'query',
      type: 'string',
      name: 'foo',
      required: true
    }
  ],
  requestBody: { // optional OpenApi v3 requestBodyObject
    content: {
      'application/json': {
        schema: {
          properties: {
            name: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  schemas: null, // an optional array or object of jsonschemas used to dereference $ref
  errorTransformer: null, // an optional transformer function to format errors
  customFormats: {
    // support `"format": "foo"` for types.
    foo: function(input) {
      return input === 'foo';
    }
  }
});

var request = {
  headers: {
    'content-type': 'application/json'
  },
  body: {},
  params: {},
  query: {foo: 'wow'}
};
var errors = requestValidator.validateRequest(request);
console.log(errors); // => undefined
```

## API

### validate(args)
#### args.parameters

An array of openapi parameters.

#### args.schemas

If given as an array, each schema must have an `id` property.  See `./test/data-driven/`
for tests with `schemas`.  Ids may be schema local (i.e. `#/definitions/SomeType`),
or URL based (i.e. `/SomeType`).  When supplied, `$ref` usage will map exactly to the
Id e.g. if `id` is `/SomeType`, `$ref` must be `/SomeType`.

If given as an object, it will be assigned to `bodySchema.definitions`.  Schemas may then be dereferenced in parameters by using `#/definitions/<key in args.schemas object>`.

#### args.version

An optional string that currently does nothing.  This will ensure nothing breaks
for new versions of openapi drafts that get added in the future.

#### args.errorTransformer

A function that transforms errors.

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

* `errorCode` - A jsonschema error suffixed with `.openapi.requestValidation`.
* `location` - One of `body`, `headers`, `path`, or `query`.  Signifies where validation
failed.
* `message` - A detailed message as to why validation failed.
* `path` - The property of the location that failed validation.

#### args.customFormats

An object of formatters to use for the `format` keyword.

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

[downloads-image]: http://img.shields.io/npm/dm/openapi-request-validator.svg
[npm-url]: https://npmjs.org/package/openapi-request-validator
[npm-image]: http://img.shields.io/npm/v/openapi-request-validator.svg

[coveralls-url]: https://coveralls.io/github/kogosoftwarellc/open-api?branch=main
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=main

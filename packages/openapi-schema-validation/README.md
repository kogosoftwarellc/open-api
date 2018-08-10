# Note: This has been deprecated in favor of openapi-schema-validator

Moving forward you can use [openapi-schema-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-schema-validator).  See [openapi-framework](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-framework) for an example.

# openapi-schema-validation [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Validate openapi documents.

## For OpenAPI v2.0 (a.k.a. swagger 2.0) and OpenAPI v3.0.0
#### Document examples and full specs:
* [Official 2.0 docs](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject)
* [Official 3.0.0 docs](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md)

## Highlights

* Validate openapi documents against openapi schema documents.
* Uses [jsonschema](https://github.com/tdegrunt/jsonschema) under the hood.
* Performant.
* Currently supports type definitions included in the `definitions` property of the
provided openapi document.
* Extensively tested.
* Small footprint.
* Supports openapi 2.0 (a.k.a. swagger 2.0) documents and openapi 3.0.0

**Huge thank you to the [gnostic](https://github.com/googleapis/gnostic) project for building up a 3.0.0 JSON schema.**


## Example
```javascript
var validateSchema = require('openapi-schema-validation').validate;
console.log(validateSchema(apiDoc, version));
```
[see here](https://github.com/tdegrunt/jsonschema#results) for example results.


## API
### .validate(apiDoc, version)
* `apiDoc` _object_ is any api document you wish to validate.
* `version` _optional number_ openapi document schema version to use (2 or 3).
    * 2 - `swagger-2.0` (default)
    * 3 - `openapi-3.0.0`

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

[downloads-image]: http://img.shields.io/npm/dm/openapi-schema-validation.svg
[npm-url]: https://npmjs.org/package/openapi-schema-validation
[npm-image]: http://img.shields.io/npm/v/openapi-schema-validation.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/open-api.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/open-api/master.svg

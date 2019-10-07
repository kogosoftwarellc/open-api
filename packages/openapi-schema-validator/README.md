# openapi-schema-validator [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> A validator for OpenAPI documents.

## Supported OpenAPI versions

* `v3`
* `v2` (formerly known as Swagger V2

## Document examples and full specs:
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

**Huge thank you to the [gnostic](https://github.com/googleapis/gnostic) project for building up a 3.0.0 JSON schema.**


## Example
```javascript
var OpenAPISchemaValidator = require('openapi-schema-validator').default;
var validator = new OpenAPISchemaValidator({
  version: 2,
  // optional
  extensions: {
    /* place any properties here to extend the schema. */
  }
});
console.log(validator.validate(apiDoc));
```

* `version` _number_ openapi document schema version to use (2 or 3).
    * 2 - `openapi-2.0.0` (default)
    * 3 - `openapi-3.0.0`

[see here](https://github.com/tdegrunt/jsonschema#results) for example results.


## API
### .validate(apiDoc)
* `apiDoc` _object_ is any api document you wish to validate.


## LICENSE
``````
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
``````

[downloads-image]: http://img.shields.io/npm/dm/openapi-schema-validator.svg
[npm-url]: https://npmjs.org/package/openapi-schema-validator
[npm-image]: http://img.shields.io/npm/v/openapi-schema-validator.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: https://api.travis-ci.org/kogosoftwarellc/open-api.svg?branch=master

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=master

[gitter-url]: https://gitter.im/kogosoftwarellc/open-api
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/open-api.png

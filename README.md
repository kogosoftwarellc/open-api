# openapi-schema-validation [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Validate openapi documents.

For OpenAPI v2.0 (a.k.a. swagger 2.0) document examples and documentation, view
[the official docs](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#itemsObject).

## Highlights

* Validate openapi documents against official openapi schema documents.
* Uses [jsonschema](https://github.com/tdegrunt/jsonschema) under the hood.
* Performant.
* Currently supports type definitions included in the `definitions` property of the
provided openapi document.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) documents.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
var validateSchema = require('openapi-schema-validation').validate;

console.log(validateSchema({/* openapi doc */}, {version: 'swagger-2.0'});
```

## API
### .validate(apiDoc [, args])

`apiDoc` is any api document you wish to validate.
`[args]` is an optional object the accepts the following arguments:
* `version` - The openapi document schema version to use.  Currently the only supported
version is `swagger-2.0` (the default).

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

[travis-url]: https://travis-ci.org/kogosoftwarellc/openapi-schema-validation
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/openapi-schema-validation.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/openapi-schema-validation
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/openapi-schema-validation/master.svg

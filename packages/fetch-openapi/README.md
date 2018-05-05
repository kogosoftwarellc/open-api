# fetch-openapi [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> Client SDK generator for openapi documents using fetch.

## Highlights

* Outputs javascript that is optimized for ES6 using the new fetch API.
* Very simple to use.
* Outputs an intuitive interface.
* Supports OpenAPI (f.k.a. Swagger) 2.0 API documents.
* Includes a cli tool (`fetch-openapi`) when you `npm install`.

## CLI Usage
```shell
fetch-openapi --api-doc-url http://petstore.swagger.io/v2/swagger.json \
              --output-file-path ./api.js \
              --preset es6
```

See `fetch-openapi -h` for more info.

Using a local api doc schema? Use the parameter `--api-doc-file-path` instead of `--api-doc-url`.

## Programatic Usage

```javascript
var fs = require('fs');
var fetchOpenapi = require('fetch-openapi');
// See http://petstore.swagger.io/v2/swagger.json for an example API doc.
var apiDoc = require('./petstore-api-doc.json');
var options = {
  preset: 'node'
};

// generator is a string of javascript.
var generator = fetchOpenApi(apiDoc, options);
fs.writeFileSync('./petStore.js', generator, 'utf8');


// now we can use the client.
var petStore = require('./petStore');
petStore.addPet({/* data */})// => handle the promise
```
## API

### fetchOpenapi(apiDoc, options)

Outputs a `createApi` function represented as a string of javascript that
you can either `eval` or write to a file.

#### apiDoc

An openapi document.  Use http://petstore.swagger.io/v2/swagger.json as an example.
See the [spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
for more details.

#### options

##### options.preset

Valid values are `node` and `es6`.  With node, `module.exports` is used.  With `es6`, `export` is used.

### createApi(options)

Creates a service you use to call your API.  Each method of the service is named after the operationId of your API's path operations.

#### options

##### options.cors

Enables cors support for `fetch` calls.

##### options.securityHandlers

An object of security scheme name / handler function.  The handler function receives 3 arguments:  `headers`, `params`, and `schemePart`.  The handler function returns `true` if the security scheme is supported, false otherwise.


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

[downloads-image]: http://img.shields.io/npm/dm/fetch-openapi.svg
[npm-url]: https://npmjs.org/package/fetch-openapi
[npm-image]: http://img.shields.io/npm/v/fetch-openapi.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/fetch-openapi
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/fetch-openapi.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/fetch-openapi
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/fetch-openapi/master.svg

[gitter-url]: https://gitter.im/kogosoftwarellc/fetch-openapi
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/fetch-openapi.png

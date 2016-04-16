# fetch-openapi [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> Client SDK generator for openapi documents using fetch.

## Highlights

* Outputs javascript that is optimized for ES6.
* Uses the fetch API.
* Very simple.
* Outputs an intuitive interface.

## Example

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

### createApi(apiDoc, options)

#### apiDoc

An openapi document.  Use http://petstore.swagger.io/v2/swagger.json as an example.
See the [spec](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
for more details.

#### options

Valid options are:

* `preset` - available values are `node` and `es6`.

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

# openapi-jsonschema-parameters [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Converts openapi parameters to a jsonschema format.

## Highlights

* No validation on the input or the output.  It is expected that you'll do this with
some other library.
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.

## Example

See `./test/data-driven` for more examples.

```javascript
var convert = require('openapi-jsonschema-parameters');

var jsonschema = convert([
  {
    in: 'query',
    name: 'foo',
    required: true,
    type: 'string'
  }
]);

console.log(jsonschema); //=>
// {
//   query: {
//     properties: {
//       foo: {
//         type: 'string'
//       }
//     },
//     required: ['foo']
//   }
// }
```


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

[downloads-image]: http://img.shields.io/npm/dm/openapi-jsonschema-parameters.svg
[npm-url]: https://npmjs.org/package/openapi-jsonschema-parameters
[npm-image]: http://img.shields.io/npm/v/openapi-jsonschema-parameters.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/openapi-jsonschema-parameters
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/openapi-jsonschema-parameters.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/openapi-jsonschema-parameters
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/openapi-jsonschema-parameters/master.svg

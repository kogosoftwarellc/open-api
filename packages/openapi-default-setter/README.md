# openapi-default-setter [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Sets default values in request properties according to defaults defined in openapi parameter lists.

## Highlights

* Effortlessly set default values in header and query request properties.
* Path parameters are not supported because it is assumed they will always have some
value.
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) parameter lists.
* Does not perform type coercion (see [openapi-request-coercer](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-coercer)).
* Does not perform validation (see [openapi-request-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-validator)).

## Example

See `./test/data-driven/*.js` for more examples.

```typescript
import OpenAPIDefaultSetter from 'openapi-default-setter';
const defaultSetter = new OpenAPIDefaultSetter({
  parameters: [
    {
      in: 'query',
      type: 'integer',
      name: 'foo',
      default: 5
    }
  ]
});
const request = {query: {} };

defaultSetter.handle(request);

console.log(req.query.foo); //=> 5
```

## API

### constructor(args)
#### args.loggingKey

A string used as a prefix for error messages and logs.  Defaults to an empty string.

#### args.parameters

An array of openapi parameters.

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

[downloads-image]: http://img.shields.io/npm/dm/openapi-default-setter.svg
[npm-url]: https://npmjs.org/package/openapi-default-setter
[npm-image]: http://img.shields.io/npm/v/openapi-default-setter.svg

[coveralls-url]: https://coveralls.io/github/kogosoftwarellc/open-api?branch=main
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=main

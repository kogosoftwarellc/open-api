# openapi-request-coercer [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Coerce request properties according to an openapi parameter list.

## Highlights

* Effortlessly coerce header, path, query and formData request properties to defined types in
an openapi parameters list.
* Handles array types.
* Performant.
* Extensively tested.
* Small footprint.
* Supports _collectionFormat_ for _formData array_ parameters.

## Example

See `./test/data-driven/*.js` for more examples.

```javascript
import OpenapiRequestCoercer from 'openapi-request-coercer';
const coercer = new OpenapiRequestCoercer({
  parameters: [
    {
      in: 'query',
      type: 'integer',
      name: 'foo',
      required: true
    }
  ]
});

const request = {
  query: {
    foo: '5'
  }
};

coercer.coerce(request);
console.log(request.query.foo); //=> 5
```

## Boolean parameters

By default a boolean parameter is coerced to:
* _false_ if the input value is "false"
* _true_ for any other input value

This behaviour makes sense if you do not wish to validate the input fields.

If the opposite is the case, the behaviour can be changed by setting the "x-openapi-coercion-strict" to _true_ on the parameter in question as illustrated below.

```javascript
import OpenapiRequestCoercer from 'openapi-request-coercer';
const coercer = new OpenapiRequestCoercer({
  parameters: [
    {
      in: 'query',
      type: 'boolean',
      name: 'foo',
      required: true,
      "x-openapi-coercion-strict": true
    }
  ]
});
```

Doing so will result in the boolean parameter being coerced to:
* _false_ if the input value is "false" (in any casing)
* _true_ if the input value is "true" (in any casing)
* _null_ for any other input value

## Implementing your own custom coercion strategy

Would `x-openapi-coercion-strict` not be strict enough to your test, or would you completely want to customize the coercion behavior you can completely define how simpler types (`boolean`, `integer` and `number`) are dealt with.

In order to do so, define a custom coercion strategy through the optional `coercionStrategy` argument.

For instance, below a sample of a strategy that will:
 - only coerce stringified boolean values when they are expressed in lowercase in a case sentive way
 - coerce integers when they are even, otherwise return null
 - as numbers aren't overridden, the default strategy will be leveraged

```javascript
import OpenapiRequestCoercer from 'openapi-request-coercer';
const coercionStrategy = {
  boolean = (input) => {
    if (typeof input === 'boolean') {
      return input;
    }
    if (input === 'false') {
      return false;
    }
    else if (input === 'true') {
      return true;
    }
    return input;
  };
  number = (input) => {
    var result = Number(input);
    return isNaN(result) || (result%2) === 1 ? null : result;
  }
};
const parameters = { /* ... */ }

const sut = new OpenapiRequestCoercer({ parameters, coercionStrategy });
const result = sut.coerce(request);
```

## API

### coerce(args)
#### args.extensionBase
Defaults to `'x-openapi-coercion'`.

#### args.loggingKey
Defaults to `''`.

#### args.parameters
An array of openapi parameters.

#### args.coercionStrategy
An object exposing the optional `boolean`, `integer`, `number` properties. Each of them, when defined is expected to accept a function accepting a parameter and returning a result.

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

[downloads-image]: http://img.shields.io/npm/dm/openapi-request-coercer.svg
[npm-url]: https://npmjs.org/package/openapi-request-coercer
[npm-image]: http://img.shields.io/npm/v/openapi-request-coercer.svg

[coveralls-url]: https://coveralls.io/github/kogosoftwarellc/open-api?branch=main
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=main

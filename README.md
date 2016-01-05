# express-openapi [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> Effortlessly add routes and middleware to express apps with openapi documents.

## Highlights

* Utilizes convention based programming.
* Unobtrusively opinionated.
* Stays as close to `express` as possible.
* Leverages openapi parameter lists for parameter defaults, type coercion,
and validation in your app's express routes.
  * See [express-openapi-defaults](https://github.com/kogosoftwarellc/express-openapi-defaults)
  * See [express-openapi-coercion](https://github.com/kogosoftwarellc/express-openapi-coercion)
  * See [express-openapi-validation](https://github.com/kogosoftwarellc/express-openapi-validation)
* Validates api documents.
  * See [openapi-schema-validation](https://github.com/kogosoftwarellc/openapi-schema-validation)
* Performant.
* Extensively tested.
* Small footprint.
* Currently supports openapi 2.0 (a.k.a. swagger 2.0) documents.
* Conforms to the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
wherever possible.
* Clean interface.
* Adds a route for Swagger UI (`apiDoc.basePath` + `args.docsPath`).

## Example

This uses the sample project located at [./test/sample-projects/basic-usage/](
https://github.com/kogosoftwarellc/express-openapi/tree/master/test/sample-projects/basic-usage).
Check out the other sample projects for complete usage examples.  You'll learn all
you need to know by studying it and the related tests.

```javascript
var app = require('express')();
var openapi = require('express-openapi');

openapi.initialize({
  apiDoc: require('./test/sample-projects/basic-usage/api-doc.js'),
  app: app,
  docsPath: '/api-docs',
  routes: './test/sample-projects/basic-usage/api-routes/'
});

```

## API

### initialize(args)

Initializes routes and middleware on an express app.

#### args.apiDoc {Object}

This is an openapi (swagger 2.0) compliant document.  See the [OpenAPI-Specification](
https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md)
for more details.

`args.apiDoc.paths` should be an empty object.  `express-openapi` will populate this
for you.  This prevents you from defining your paths in 2 places.

`args.apiDoc.basePath` will add a prefix to all routes added by `express-openapi`.

`args.apiDoc.definitions` will be used for de-referencing `$ref` properties in
parameters.

#### args.app {Object}

This is the express app you with to initialize.

#### args.routes {String}

A path to the directory that contains your route files.

Route files are logically structured according to their URL path.

For example, if you have the following routes that you wish to add to your express
app:

```
GET /v1/users/:id
POST /v1/users
```

You would define `basePath: '/v1'` in your `apiDoc`, and layout your `routes` directory
as follows:

```
<project>
        `routes/
               `users/
                     `:id.js
                users.js
```

The contents of `<project>/routes/users/:id.js` would look like this:

```javascript
module.exports = {
  get: [
    /* business middleware not expressible by openapi documentation goes here */
    function(req, res) {
      res.status(200).json(/* return the user or an error */);
    }
  ]
};

module.exports.get.apiDoc = {
  description: 'A description for retrieving a user.',
  tags: ['users'],
  operationId: 'getUser',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      type: 'integer'
    }
  ]
};

```

Modules under `args.routes` expose methods.  Methods may either be a method handler
function, or an array of business specific middleware + a method handler.

`express-openapi` will prepend middleware to this stack based on the parameters
defined in the method's `apiDoc` property.  If no `apidoc` property exists on the
module method, then `express-openapi` will add no additional middleware.

#### args.docsPath {String} [optional]

Changes the default location (`/api-docs`) to serve up `args.apiDoc` with populated
paths.  This is imoprtant if you wish to support multiple versions of your app and
for Swagger UI support.

#### args.errorTransformer {Function} [optional]

Transforms errors to a standard format as defined by the application.  See
[express-openapi-validation#args.errorTransformer](
https://github.com/kogosoftwarellc/express-openapi-validation#argserrortransformer
) for more info.


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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi.svg
[npm-url]: https://npmjs.org/package/express-openapi
[npm-image]: http://img.shields.io/npm/v/express-openapi.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi/master.svg

# express-openapi [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> An unopinionated OpenAPI framework for express

## Highlights

* Performant.
* Extensively tested.
* Unobtrusively opinionated.
* Stays as close to `express` as possible.
* Leverages openapi parameter lists for parameter defaults, type coercion,
and validation.
  * See [express-openapi-defaults](https://github.com/kogosoftwarellc/express-openapi-defaults)
  * See [express-openapi-coercion](https://github.com/kogosoftwarellc/express-openapi-coercion)
  * See [express-openapi-validation](https://github.com/kogosoftwarellc/express-openapi-validation)
* Leverages OpenAPI response definitions to provide `res.validateResponse` tailored to a particular route.
  * See [express-openapi-response-validation](https://github.com/kogosoftwarellc/express-openapi-response-validation)
* Leverages security definitions for security management.
  * See [express-openapi-security](https://github.com/kogosoftwarellc/express-openapi-security)
* Validates api documents.  * See [openapi-schema-validation](https://github.com/kogosoftwarellc/openapi-schema-validation)
* Configurable Middleware.
  * See [Configuring Middleware](#configuring-middleware)
* Supports custom `format` validators.
  * See [args.customFormats](#argscustomformats)
* Supports `collectionFormat` for `formData` `array` parameters.
* Currently supports OpenAPI 2.0 (f.k.a. swagger 2.0) documents.
* Conforms to the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).
* Clean interface.
* Supports error middleware scoped to your API's `basePath`.
  * See [args.errorMiddleware](#argserrormiddleware)
* Adds a route for Swagger UI (`apiDoc.basePath` + `args.docsPath`).
* Adds operation tags to your apiDoc.tags array and sorts them alphabetically for you.
  * See how it's done in the [basic-usage](
https://github.com/kogosoftwarellc/express-openapi/tree/master/test/sample-projects/basic-usage/api-doc.js#L37)
    sample project.
* Supports TypeScript
  * See [Work with TypeScript](#work-with-typescript)
* Supports external schema references
  * See [args.externalSchemas](#argsexternalschemas)
* Client SDK generators available.
  * See [fetch-openapi](https://github.com/kogosoftwarellc/fetch-openapi).
* Adds `apiDoc` and `operationDoc` to requests E.G. `req.apiDoc` and `req.operationDoc`
* Handles request payloads with `consumes` mimeTypes.
  * See [args.consumesMiddleware](#argsconsumesmiddleware)
* Supports matching paths by regex to set `security` in `operation` docs.
  * See [args.pathSecurity](#argspathsecurity)

## Table of Contents

* [What is OpenAPI](#what-is-openapi)
* [Getting Started](#getting-started)
* [Configuring Middleware](#configuring-middleware)
  * [Supported Vendor Extensions](#supported-vendor-extensions)
* [API](#api)
  * [.initialize(args)](#initializeargs)
    * [args.apiDoc](#argsapidoc)
    * [args.app](#argsapp)
    * [args.consumesMiddleware](#argsconsumesmiddleware)
    * [args.customFormats](#argscustomformats)
    * [args.dependencies](#argsdependencies)
    * [args.docsPath](#argsdocspath)
    * [args.errorMiddleware](#argserrormiddleware)
    * [args.errorTransformer](#argserrortransformer)
    * [args.exposeApiDocs](#argsexposeapidocs)
    * [args.externalSchemas](#argsexternalschemas)
    * [args.pathSecurity](#argspathsecurity)
    * [args.paths](#argspaths)
    * [args.securityHandlers](#argssecurityhandlers)
    * [args.validateApiDoc](#argsvalidateapidoc)
* [Using with TypeScript](#using-with-typescript)
  * [Prerequisites](#prerequisites)
  * [TypeScript Example](#typescript-example)
* [License](#license)

## What is OpenAPI?

Taken from [openapis.org](https://openapis.org/specification):

> The goal of the OAI specification is to define a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interfaces have done for lower-level programming

To study the current specification [view the docs](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md).

## Getting Started

*To see example projects, look at our [test suite](./test/sample-projects/).*

This getting started guide will use the most fundamental concepts of OpenAPI and
`express-openapi`.

1. Create your API's main apiDoc.  You can create it anywhere.  For this example
   we'll create it in under an `api-v1/` directory:

    ```javascript
    // ./api-v1/api-doc.js

    const apiDoc = {
      swagger: '2.0',
      basePath: '/v1',
      info: {
        title: 'A getting started API.',
        version: '1.0.0'
      },
      definitions: {
        World: {
          type: 'object',
          properties: {
            name: {
              description: 'The name of this world.',
              type: 'string'
            }
          },
          required: ['name']
        }
      },
      paths: {}
    };

    export default apiDoc;
    ```

    You may be wondering why `paths` is an empty object literal.  We'll get to that in a second.

    This is all that is required for our API's main apiDoc.  To see the full list of values
    and options for the main apiDoc you can view [The Schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema).

1. Create path handlers.

    Our `paths` object was empty in the main apiDoc because `express-openapi` generates
    it for us based on the location of our path handlers.  For this example we'll place
    our path handlers under `api-v1/paths/`.

    Let's create a `worlds` path:

    ```javascript
    // ./api-v1/paths/worlds.js
    export default function(worldsService) {
      let operations = {
        GET
      };

      function GET(req, res, next) {
        res.status(200).json(worldsService.getWorlds(req.query.worldName));
      }

      GET.apiDoc = {
        summary: 'Returns worlds by name.',
        operationId: 'getWorlds',
        parameters: [
          {
            in: 'query',
            name: 'worldName',
            required: true,
            type: 'string'
          }
        ],
        responses: {
          200: {
            description: 'A list of worlds that match the requested name.',
            schema: {
              type: 'array',
              items: {
                $ref: '#/definitions/World'
              }
            }
          },
          default: {
            description: 'An error occurred',
            schema: {
              additionalProperties: true
            }
          }
        }
      };

      return operations;
    }
    ```

    In OpenAPI we define what operations a path exposes.  Operations are exposed as HTTP
    methods.

    The `apiDoc` property of the `GET` http method configures the `getWorld` operation
    with `express-openapi`.  Without it `express-openapi` would do nothing with it.  We
    can see that `worldName` is a required query parameter.  If we were to call this
    operation without `worldName` we would receive a 400 input validation error.

    In this example, we're also using dependency injection.  This allows us to easily
    connect our path handlers with our API's services.  We could've exposed an object
    literal instead of a function.  The dependency injection approach is recommended
    which is why we use it here.

1. Create services

    We referenced a `worldsService` in our path handler, let's create it now.  It's
    best to place services that conform to your API's object definitions under a versioned
    folder.  This keeps API versioned code separately and allows you to scale your app
    for multiple API versions.

    ```javascript
    // ./api-v1/services/worldsService.js

    let worlds = {
      Earth: {
        name: 'Earth'
      }
    };

    const worldsService = {
      getWorlds(name) {
        return worlds[name] ? [worlds[name]] : [];
      }
    };

    export default worldsService;
    ```

1. Initialize your `express` app with `express-openapi`

    We'll create our app file as usual and we'll initialize it with `express-openapi`:

    ```javascript
    // ./app.js
    import express from 'express';
    import openapi from 'express-openapi';
    import v1WorldsService from './api-v1/services/worldsService';
    import v1ApiDoc from './api-v1/api-doc';

    const app = express();
    openapi.initialize({
      app,
      apiDoc: v1ApiDoc,
      dependencies: {
        worldsService: v1WorldsService
      },
      paths: './api-v1/paths'
    });

    app.listen(3000);
    ```
Our paths are now active and we can test them out with [Swagger UI](http://petstore.swagger.io/).  This getting started guide
didn't cover everything.  For more examples see the [sample projects](https://github.com/kogosoftwarellc/express-openapi/tree/master/test/sample-projects) used in our
extensive test suite.

## Configuring Middleware

You can directly control what middleware `express-openapi` adds to your express app
by using the following vendor extension properties.  These properties are scoped, so
if you use one as a root property of your API Document, all paths and operations will
be affected.  Similarly if you just want to configure middleware for an operation,
you can use these properties in said operation's apiDoc.  See full examples in the
[./test/sample-projects/](
https://github.com/kogosoftwarellc/express-openapi/tree/master/test/sample-projects)
directory.

### Supported vendor extensions

* `'x-express-openapi-additional-middleware': [myMiddleware]` - Adds the provided
middleware _after_ defaults, coercion, and validation middleware (added by
`express-openapi`) but _before_ middleware defined in operations.  This property
inherits from all previous properties.
* `'x-express-openapi-inherit-additional-middleware': false` - Prevents middleware
added in a parent scope with `x-express-openapi-additional-middleware`.  This extension
works from the methodDoc up to the apiDoc, as opposed to the apiDoc down to the methodDoc.
The effect is that using this extension in the methodDoc would prevent that method
from receiving any additional middleware defined in parent scopes.  You can use this
extension in any scope (methodDoc, pathDoc, or apiDoc) and the result i the same.
* `'x-express-openapi-disable-middleware': true` - Disables all middleware.
* `'x-express-openapi-disable-coercion-middleware': true` - Disables coercion middleware.
* `'x-express-openapi-disable-defaults-middleware': true` - Disables
defaults middleware.
* `'x-express-openapi-disable-response-validation-middleware': true` - Disables
response validation middleware I.E. no `res.validateResponse` method will be
available in the affected operation handler method.
* `'x-express-openapi-disable-validation-middleware': true` - Disables input
validation middleware.

## API

### .initialize(args)

Initializes paths and middleware on an express app, and returns an initialized
api.  An initialized api contains the following properties:

* `apiDoc` - This is the final result of the apiDoc after processing.

#### args.apiDoc

|Type|Required|Description|
|----|--------|-----------|
|Object|Y|This is an OpenAPI (swagger 2.0) compliant document.  See the [OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) for more details.|

`args.apiDoc.paths` should be an empty object.  `express-openapi` will populate this
for you.  This prevents you from defining your paths in 2 places.

`args.apiDoc.basePath` will add a prefix to all paths added by `express-openapi`.

`args.apiDoc.definitions` will be used for de-referencing `$ref` properties in
parameters.

#### args.app

|Type|Required|Description|
|----|--------|-----------|
|Object|Y|The express app you wish to initialize.|

#### args.consumesMiddleware

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|A key value map of mimeTypes and middleware.|

Each key is the mime type from the consumes array of either the apiDoc or the operation doc.

```javascript
var bodyParser = require('body-parser');
openapi.initialize({
  /*...*/
  consumesMiddleware: {
    'application/json': bodyParser.json(),
    'text/text': bodyParser.text()
  }
  /*...*/
});
```

#### args.customFormats

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|An object of custom formats.|

Each key is the name of the format to be used with the `format` keyword.  Each value
is a function that accepts an input and returns a boolean value.

```javascript
openapi.initialize({
  /*...*/
  customFormats: {
    myFormat: function(input) {
      return input === 'foo';
    }
  }
  /*...*/
});
```

See Custom Formats in [jsonschema](https://github.com/tdegrunt/jsonschema#custom-formats).

#### args.dependencies

|Type|Required|Description|
|----|--------|-----------|
|Object|N|Mapping from keys to dependency objects that can be injected as named parameters into path handlers exported as functions |

If not set, then all path handlers export an object. If set, then all path handlers export a constructor function whose signature may contain
any of the keys in args.dependencies

Example
```javascript
// ├── api-doc.js
// ├── api-paths1
// │   └── users.js
// ├── api-paths2
// │   └── location.js
// └── app.js

// app.js
// create some backend services. You can use typescript.

// a mock data provider, for testing or local development
var mockDataProvider = require("custom-mock-data-provider");

// a pretend geo service, as an example of allowing route handlers to perform external interactions
var geoService = require("awesome-geo-service")({url: "http.example.com/geoservice"});

openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: [
        path.resolve(__dirname, 'api-paths'),
    ],

    // Provide a mapping of dependency names.
    // The keys of this object can be named parameters in the signature of
    // the functions exported from the modules in your paths directory.
    dependencies: {
        dataprovider: mockDataProvider(),
        geoservice: geoService
    }
});

// api-paths1/users.js
// inject both a dataprovider and geoservice dependency.
module.exports = function(geoservice, dataprovider) {
    var doc = {
        GET: function (req, res, next) {
            res.json({user: dataprovider.getUser(req.params.userid), location: geoservice.getUserLocation(req.params.userid)});
        }
    };
    doc.GET.apiDoc = {
        ...
    };
    return doc;
};


// api-paths2/location.js
// only inject a geoservice dependency.
module.exports = function(geoservice) {
    var doc = {
        GET: function (req, res, next) {
            res.json({location: geoservice.getUserLocation(req.session.user.id)});
        }
    };
    doc.GET.apiDoc = {
        ...
    };
    return doc;
};
```

#### args.docsPath

|Type|Required|Default Value|Description|
|----|--------|-----------|----|
|String|N|/api&#8209;docs|Sets the path that Swagger UI will use to request `args.apiDoc` with populated paths.  You can use this to support multiple versions of your app.|

#### args.errorMiddleware

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|A middleware function that is scoped to your api's basePath.|

This is just standard express error middleware (I.E. it has 4 arguments `err, req, res, next`).
When an error occurs in your API's handlers, it'll be passed to this middleware.  The
rest of your app is unaffected.

```javascript
openapi.initialize({
  apiDoc: require('v3-api-doc'),
  /*...*/
  errorMiddleware: function(err, req, res, next) { // only handles errors for /v3/*
      /* do something with err in a v3 way */
  }
  /*...*/
});
```

#### args.errorTransformer

|Type|Required|Description|
|----|--------|-----------|
|Function|N|Transforms errors to a standard format as defined by the application.  See [express-openapi-validation#args.errorTransformer](https://github.com/kogosoftwarellc/express-openapi-validation#argserrortransformer) and [express-openapi-response-validation](https://github.com/kogosoftwarellc/express-openapi-response-validation) for more info.|

#### args.exposeApiDocs

|Type|Required|Default Value|Description|
|----|--------|-----------|-------|
|Boolean|N|true|Adds a route at `args.apiDoc.basePath` + `args.docsPath`.  The route will respond with `args.apiDoc`.|

#### args.externalSchemas

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|Map id to pre-loaded external schema|

This is used to resolve a schema reference `$ref`. Id can be a URL or relative path from `args.docPath`.

```javascript
openapi.initialize({
  apiDoc: require('v3-api-doc'),
  /*...*/
  externalSchemas: {
    'http://example.com/schema': {
      description: "example schema",
      type: object,
      /*....*/
    },
    'http://example.com/another-schema': {
      /*....*/
    }
  }
  /*...*/
});
```

And then you can reference them in your api-doc file and route handlers.
```javascript
{
  /*...*/
  parameters: {
    foo: {
      "in": "body",
      name: "foo",
      schema: { $ref: 'http://example.com/schema'}
    }
  },
  /*...*/
  definitions: {
   bar: { $ref: 'http://example.com/another-schema#/definitions/bar'}
  }
}
```
or
```javascript
put.apiDoc = {
  /*...*/
  parameters: [
    {
      "in": "body",
      name: "foo",
      schema: { $ref: 'http://example.com/schema'}
    }
  ],
 /*...*/
}
```

#### args.pathSecurity

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Array|N|null|An array of tuples.|

Each tuple in the array consists of a `RegExp` to match paths, and a `security`
definition (see [security](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#operation-object)).  The tuples are traversed in reverse order, so the bottom
most matching `RegExp` wins.  When a matching definition is found and the operation
had no `security` defined, it is added to the `operationDoc` and security middleware
is applied.

```javascript
openapi.initialize({
  apiDoc: require('v3-api-doc'),
  /*...*/
  pathSecurity: [
    // here /some/{pathId} will get theirSecurity.
    [/^\/some/\{pathId\}/, [{mySecurity:[]}]],
    [/^\/some/\{pathId\}/, [{theirSecurity:[]}]]
  ]
  /*...*/
});
```

#### args.paths

|Type|Required|Description|
|----|--------|-----------|
|String or Array|Y|Relative path or paths to the directory or directories that contain your route files.|


Path files are logically structured according to their URL path.  For cross platform
compatibility, URLs that accept a parameter use the swagger format for parameters
as opposed to the express format (i.e. use `{id}` instead of `:id`).  Filenames in
Windows do not allow the `:` character as it is confused with drive names.

For example, if you have the following api paths that you wish to add to your express
app:

```
GET /v1/users/{id}
POST /v1/users
```

You would define `basePath: '/v1'` in your `apiDoc`, and layout your `paths` directory
as follows:

```
<project>
        `paths/
               `users/
                     `{id}.js
                users.js
```

The contents of `<project>/paths/users/{id}.js` would look like this:

```javascript
module.exports = {
  // parameters for all operations in this path
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      type: 'integer'
    }
  ],

  /*
    Also available are:
    GET
    DELETE
    PATCH
    OPTIONS
    del
    delete
    patch...
    see index.js for the full list.
  */

  get: [
    /* business middleware not expressible by OpenAPI documentation goes here */
    function(req, res, next) {
      var validationError = res.validateResponse(200, /* return the user or an error */);

      if (validationError)
        return next(validationError);
      }

      res.status(200).json(/* return the user or an error */);
    }
  ],

  post: post
};

module.exports.get.apiDoc = {
  description: 'A description for retrieving a user.',
  tags: ['users'],
  operationId: 'getUser',
  // parameters for this operation
  parameters: [
    {
      in: 'query',
      name: 'firstName',
      type: 'string'
    }
  ],
  responses: {
    default: {
      $ref: '#/definitions/Error'
    }
  }
};

function post(req, res, next) {
  /* ... */
}

post.apiDoc = {
  /* ... */
};

```

Modules under `args.paths` expose methods.  Methods may either be a method handler
function, or an array of business specific middleware + a method handler function.

`express-openapi` will prepend middleware to this stack based on the parameters
defined in the method's `apiDoc` property.  If no `apidoc` property exists on the
module method, then `express-openapi` will add no additional middleware.

#### args.securityHandlers

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|Map name of security scheme name to a handler function.|

If you'd like to support security, define your schemes in your apiDoc like so:

```javascript
var apiDoc = {
  swagger: 2.0,
  /* ... */
  securityDefinitions: {
    keyScheme: {
      type: 'apiKey',
      name: 'api_key',
      in: 'header'
    },
    passwordScheme: {
      type: 'basic'
    }
  }
};
```

Next you can define your security handlers in the OpenAPI initialization args:

```javascript
openapi.initialize({
  apiDoc: apiDoc,
  app: app,
  securityHandlers: {
    keyScheme: function(req, scopes, definition, cb) {
      /* do something.  You can assign values to req to make them available in
      operation handlers. */
      cb(null, true);
    },
    passwordScheme: function(req, scopes, definition, cb) {
      /* do something */
      cb({
        status: 401,
        challenge: 'Basic realm=foo',
        message: 'You must authenticate to access foo.'
      });
    }
  }
});
```

Now you can use `security` in your operation docs, or in the api doc.

```javascript
module.exports = {
  post: post
};

function post(req, res, next) {
  /* code */
}

post.apiDoc = {
  /* ... */
  security: [
    {
      passwordScheme: []
    },
    // if the previous set of security schemes fail, we move to the next block.
    {
      keyScheme: []
    }
  ]
};
```

See [express-openapi-security](https://github.com/kogosoftwarellc/express-openapi-security)
for more details.

#### args.validateApiDoc

|Type|Required|Default Value|Description|
|----|--------|-----------|-------|
|Boolean|N|true|Validates `args.apiDoc` before and after path population.  This does not effect individual route validation of route parameters.  You can disable this behavior by passing `false`.|

## Using with TypeScript

This package includes definitions for TypeScript.

### Prerequisites

Install definitions for `express` and `body-parser`(optional) via
[typings](https://www.npmjs.com/package/typings).

### TypeScript Example

In server script:
```typescript
import * as express from "express";
import * as bodyParser from "body-parser";
import * as openapi from "express-openapi";

var app = express();

app.use(bodyParser.json());

openapi.initialize({
    apiDoc: require('./api-doc.js'),
    app: app,
    paths: './built/api-paths'
});

app.use(<express.ErrorRequestHandler>(err, req, res, next) => {
    res.status(err.status).json(err);
});

app.listen(3000);
```

In route handler file like `<project>/src/api-paths/users/{id}.ts`:
```typescript

import {Operation} from "express-openapi";

export var parameters = [
  {
    in: 'path',
    name: 'id',
    required: true,
    type: 'integer'
  }
 ];

export var get: Operation = [
    /* business middleware not expressible by OpenAPI documentation goes here */
    (req, res, next) => {
        res.status(200).json(/* return the user */);
    }
];

get.apiDoc = {
  description: 'A description for retrieving a user.',
  tags: ['users'],
  operationId: 'getUser',
  // parameters for this operation
  parameters: [
    {
      in: 'query',
      name: 'firstName',
      type: 'string'
    }
  ],
  responses: {
    default: {
      $ref: '#/definitions/Error'
    }
  }
};

export var post: Operation = (req, res, next) => {
    /* ... */
}

post.apiDoc = {
    /* ... */
};
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

[downloads-image]: http://img.shields.io/npm/dm/express-openapi.svg
[npm-url]: https://npmjs.org/package/express-openapi
[npm-image]: http://img.shields.io/npm/v/express-openapi.svg

[travis-url]: https://travis-ci.org/kogosoftwarellc/express-openapi
[travis-image]: http://img.shields.io/travis/kogosoftwarellc/express-openapi.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/express-openapi
[coveralls-image]: http://img.shields.io/coveralls/kogosoftwarellc/express-openapi/master.svg

[gitter-url]: https://gitter.im/kogosoftwarellc/express-openapi
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/express-openapi.png

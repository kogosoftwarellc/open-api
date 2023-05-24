# express-openapi [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Coveralls Status][coveralls-image]][coveralls-url]
> An unopinionated OpenAPI framework for express

## Highlights

* Supported versions:
  * OpenAPI 2.0 (f.k.a. swagger 2.0)
  * OpenAPI 3.0
* Performant.
* Extensively tested.
* Unobtrusively opinionated.
* Stays as close to `express` as possible.
* Write API documentation in JSON or Yaml
  * See [args.apiDoc](#argsapidoc)
* Supports Promise based middleware and response handlers.
  * See [args.promiseMode](#argspromisemode)
* Supports Security Filtering
  * See [args.securityFilter](#argssecurityfilter)
* Leverages openapi parameter lists for parameter defaults, type coercion,
and validation.
  * See [openapi-default-setter](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-default-setter)
  * See [openapi-request-coercer](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-coercer)
  * See [openapi-request-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-validator)
* Leverages OpenAPI response definitions to provide `res.validateResponse` tailored to a particular route.
  * See [openapi-response-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-response-validator)
* Leverages security definitions for security management.
  * See [openapi-security-handler](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-security-handler)
* Validates api documents.
  * See [openapi-schema-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-schema-validator)
* Supports schema extension.
  * See [Extending OpenAPI Schema](#extending-openapi-schema)
* Configurable Middleware.
  * See [Configuring Middleware](#configuring-middleware)
* Supports custom `format` validators.
  * See [args.customFormats](#argscustomformats)
* Supports custom `keywords` validators (`openapi-request-validator` only).
  * See [args.customKeywords](#argscustomkeywords)
* Supports `collectionFormat` for `formData` `array` parameters.
* Conforms to the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).
* Clean interface.
* Supports error middleware scoped to your API's `basePath`.
  * See [args.errorMiddleware](#argserrormiddleware)
* Adds a route for Swagger UI (`apiDoc.basePath` + `args.docsPath`).
* Adds operation tags to your apiDoc.tags array and sorts them alphabetically for you.
  * See how it's done in the [basic-usage](
https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects/basic-usage/api-doc.js#L37)
    sample project.
* Supports TypeScript
  * See [Using with TypeScript](#using-with-typescript)
* Supports external schema references
  * See [args.externalSchemas](#argsexternalschemas)
* Client SDK generators available.
  * See [fetch-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/fetch-openapi).
* Adds `apiDoc` and `operationDoc` to requests E.G. `req.apiDoc` and `req.operationDoc`
* Handles request payloads with `consumes` mimeTypes.
  * See [args.consumesMiddleware](#argsconsumesmiddleware)
* Supports matching paths by regex to set `security` in `operation` docs.
  * See [args.pathSecurity](#argspathsecurity)

## Table of Contents

* [What is OpenAPI](#what-is-openapi)
* [Getting Started](#getting-started)
* [Vendor Extensions](#vendor-extensions)
  * [Operation parameters](#operation-parameters)
  * [Configuring Middleware](#configuring-middleware)
* [API](#api)
  * [initialize(args)](#initializeargs)
    * [args.apiDoc](#argsapidoc)
    * [args.app](#argsapp)
    * [args.consumesMiddleware](#argsconsumesmiddleware)
    * [args.customFormats](#argscustomformats)
    * [args.customKeywords](#argscustomkeywords)
    * [args.dependencies](#argsdependencies)
    * [args.docsPath](#argsdocspath)
    * [args.enableObjectCoercion](#argsenableobjectcoercion)
    * [args.errorMiddleware](#argserrormiddleware)
    * [args.errorTransformer](#argserrortransformer)
    * [args.exposeApiDocs](#argsexposeapidocs)
    * [args.externalSchemas](#argsexternalschemas)
    * [args.operations](#argsoperations)
    * [args.pathSecurity](#argspathsecurity)
    * [args.paths](#argspaths)
    * [args.pathsIgnore](#argspathsignore)
    * [args.promiseMode](#argspromisemode)
    * [args.routesGlob](#argsroutesglob)
    * [args.routesIndexFileRegExp](#argsroutesindexfileregexp)
    * [args.securityHandlers](#argssecurityhandlers)
    * [args.validateApiDoc](#argsvalidateapidoc)
* [Using with TypeScript](#using-with-typescript)
  * [Prerequisites](#prerequisites)
  * [TypeScript Example](#typescript-example)
* [Supported Versions of Node](#supported-versions-of-node)
* [License](#license)

## What is OpenAPI?

Taken from [openapis.org](https://openapis.org/specification):

> The goal of the OAI specification is to define a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interfaces have done for lower-level programming

To study the current specification [view the docs](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md).

## Getting Started

*To see example projects, look at our [test suite](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects).*

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

    You may be wondering why `paths` can be an empty object literal.  We'll get to that in a second.

    This is all that is required for our API's main apiDoc.  To see the full list of values
    and options for the main apiDoc you can view [The Schema](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#schema).

    **Note:** You can also use a YAML string instead of javascript objects e.g.

    ```yaml
    # ./api-v1/api-doc.yml
    swagger: '2.0'
    basePath: '/v1'
    info:
      title: 'A getting started API.'
      version: '1.0.0'
    definitions:
      World:
        type: 'object'
        properties:
          name:
            description: 'The name of this world.'
            type: 'string'
        required:
          - 'name'
    paths: {}
    ```

1. Create path handlers.

    Our `paths` object was empty in the main apiDoc because `express-openapi` will generate it for us
    based on the location of our path handlers.
    For this example we'll place our path handlers under `api-v1/paths/`.

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

      // NOTE: We could also use a YAML string here.
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

    **Note:** If you prefer not to follow this design driven approach, or if you'd
    rather have your API's documentation solely in the apiDoc file, you can provide
    operation handlers with [args.operations](#argsoperations).

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
    import { initialize } from 'express-openapi';
    import v1WorldsService from './api-v1/services/worldsService';
    import v1ApiDoc from './api-v1/api-doc';

    const app = express();
    initialize({
      app,
      // NOTE: If using yaml you can provide a path relative to process.cwd() e.g.
      // apiDoc: './api-v1/api-doc.yml',
      apiDoc: v1ApiDoc,
      dependencies: {
        worldsService: v1WorldsService
      },
      paths: './api-v1/paths'
    });

    app.listen(3000);
    ```
Our paths are now active and we can test them out with [Swagger UI](http://petstore.swagger.io/).  This getting started guide
didn't cover everything.  For more examples see the [sample projects](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects) used in our
extensive test suite.

## Vendor extensions

OpenAPI allows vendor extensions to be used throughout your api doc.

### Operation parameters

* `'x-express-openapi-case-sensitive': false` - Use this in parameter definitions to
  allow parameter names to be case insensitive.  Use cases may include moving from
  a legacy application that didn't enforce case sensitivity (see #49).

  ```javascript
  GET.apiDoc = {
    ...
    parameters: [
      {
        name: 'paramName',
        in: 'query',
        type: 'string',
        required: true,
        'x-express-openapi-case-sensitive': false
      }
    ],
    ...
  };
  ```

  Calling this operation with `paramname=5` will not affect the validity of the request
  and your path handler will receive `paramName=5`.

### Extending OpenAPI Schema

* `x-express-openapi-schema-extension: {}` - Use this to extend the schema being used.  An
  example use case can be allowing `oneOf` with version 2.0 documents.

  i.e.

  ```
  x-express-openapi-schema-extension: {
    definitions: {
      schema: {
        properties: {
          oneOf: {
            type: "array",
            minItems: 1,
            items: {
              $ref: "#/definitions/schema"
            }
          }
        }
      }
    }
  }
  ```

### Configuring Middleware

You can directly control what middleware `express-openapi` adds to your express app
by using the following vendor extension properties.  These properties are scoped, so
if you use one as a root property of your API Document, all paths and operations will
be affected.  Similarly if you just want to configure middleware for an operation,
you can use these properties in said operation's apiDoc.  See full examples in the
[./test/sample-projects/](
https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects)
directory.


* `'x-express-openapi-additional-middleware': [myMiddleware]` - Adds the provided
middleware _after_ defaults, coercion, and validation middleware (added by
`express-openapi`) but _before_ middleware defined in operations and _before_ the response is sent.  This property
inherits from all previous properties. For an example of how to perform global response validation based on this extension, see [Express Middleware to Validate Responses on All Routes](#express-middleware-to-validate-responses-on-all-routes)
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

#### Express Middleware to Validate Responses on All Routes

By overriding the implementation of `res.send` within a middleware function, it is possible to perform `res.validateResponse` on all paths, and allow the paths to use `res.send` or `res.json`. The example below is how such a middleware might be added to `app.js`.

```javascript
function validateAllResponses(req, res, next) {
    const strictValidation = req.apiDoc['x-express-openapi-validation-strict'] ? true : false;
    if (typeof res.validateResponse === 'function') {
        const send = res.send;
        res.send = function expressOpenAPISend(...args) {
          const onlyWarn = !strictValidation;
          if (res.get('x-express-openapi-validation-error-for') !== undefined) {
              return send.apply(res, args);
          }
          const body = args[0];
          let validation = res.validateResponse(res.statusCode, body);
          let validationMessage;
          if (validation === undefined) {
              validation = { message: undefined, errors: undefined };
          }
          if (validation.errors) {
              const errorList = Array.from(validation.errors).map(_ => _.message).join(',');
              validationMessage = `Invalid response for status code ${res.statusCode}: ${errorList}`;
              console.warn(validationMessage);
              // Set to avoid a loop, and to provide the original status code
              res.set('x-express-openapi-validation-error-for', res.statusCode.toString());
          }
          if (onlyWarn || !validation.errors) {
              return send.apply(res, args);
          } else {
              res.status(500);
              return res.json({ error: validationMessage });
          }
      }
    }
    next();
}

initialize({
    app: app,
    paths: path.resolve(__dirname, 'api-paths'),
    apiDoc: {
        ...apiDoc,
        'x-express-openapi-additional-middleware': [validateAllResponses],
        'x-express-openapi-validation-strict': true
    }
});
```


## API

### initialize(args)

Initializes paths and middleware on an express app, and returns an initialized
api.  An initialized api contains the following properties:

* `apiDoc` - This is the final result of the apiDoc after processing.

#### args.apiDoc

|Type|Required|Description|
|----|--------|-----------|
|Object or String|Y|This is an OpenAPI (swagger 2.0) compliant document.  See the [OpenAPI-Specification](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md) for more details.|

`args.apiDoc.paths` can be an empty object. In that case `express-openapi` will populate this
for you based on your operation level apiDocs.
It is also possible to have just [one central apiDoc](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects/basic-usage-with-central-apiDoc).

`args.apiDoc.basePath` will add a prefix to all paths added by `express-openapi`.

`args.apiDoc.definitions` will be used for de-referencing `$ref` properties in
parameters.

You may pass a javascript object or a YAML string.

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
initialize({
  /*...*/
  consumesMiddleware: {
    'application/json': bodyParser.json(),
    'text/text': bodyParser.text()
  }
  /*...*/
});
```

By adding a middleware handler for 'multipart/form-data' file uploads can be processed. For example, using [multer](https://github.com/expressjs/multer):

```javascript
var multer = require('multer');
initialize({
  /*...*/
  consumesMiddleware: {
    'multipart/form-data': function(req, res, next) {
      multer().any()(req, res, function(err) {
        if (err) return next(err);
        req.files.forEach(function(f) {
          req.body[f.fieldname] = ''; // Set to empty string to satisfy OpenAPI spec validation
        });
        return next();
      });
    }
  }
  /*...*/
});
```

Now you can access your non-file fields via `req.body`, and your files via `req.files`. See a full example in the [with-consumes-middleware-multipart-openapi3](
https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects/with-consumes-middleware-multipart-openapi3) test.

#### args.customFormats

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|An object of custom formats.|

Each key is the name of the format to be used with the `format` keyword.  Each value
is a function that accepts an input and returns a boolean value.

```javascript
initialize({
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

#### args.customKeywords

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|An object of AJV KeywordDefinitions.|

Each key is the name of a custom keyword. Each value is an AJV keyword definition.
Asynchronous keywords are not suported!

```javascript
initialize({
  /*...*/
  customKeywords: {
    'x-custom-keyword': {
      modifying: false,
      errors: false,
      validate: function () {
        return true;
      }
    }
  }
  /*...*/
});
```

See Custom Keywords in [AJV](https://ajv.js.org/custom.html).

See example [with-customKeywords](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/test/sample-projects/with-customKeywords)
on how to use custom keywords for type coercion.

#### args.dependencies

|Type|Required|Description|
|----|--------|-----------|
|Object|N|Mapping from keys to dependency objects that can be injected as named parameters into path handlers exported as functions |

For path handlers that export a function instead of an object.  The parameter names of the exported function directly map to keys listed in this object.

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

initialize({
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
|String|N|/api-docs|Sets the path that Swagger UI will use to request `args.apiDoc` with populated paths.  You can use this to support multiple versions of your app.|

#### args.enableObjectCoercion

|Type|Required|Default Value|Description|
|----|--------|-----------|----|
|Boolean|N|false|Enables object coercion in requests.|

See [openapi-request-coercer](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-coercer)

#### args.errorMiddleware

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Object|N|null|A middleware function that is scoped to your api's basePath.|

This is just standard express error middleware (I.E. it has 4 arguments `err, req, res, next`).
When an error occurs in your API's handlers, it'll be passed to this middleware.  The
rest of your app is unaffected.

**Note:** 4 arguments (no more, no less) must be defined in your errorMiddleware function. Otherwise the function will be silently ignored.

```javascript
initialize({
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
|Function|N|Transforms errors to a standard format as defined by the application.  See [openapi-request-validator#args.errorTransformer](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-validator#argserrortransformer) and [openapi-response-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-response-validator) for more info.|

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
initialize({
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
#### args.operations

|Type|Required|Description|
|----|--------|-----------|
|Object|Y (unless args.paths is provided)|An Object whose keys are operationIds in your apiDoc and whose values are operation handlers (functions)|

Consider the following example:

```yml
# ./apiDoc.yml
swagger: '2.0'
info:
  title: sample api doc
  version: '3'
paths:
  /foo:
    get:
      operationId: getFoo
      responses:
        default:
          description: return foo
          schema: {}
```

```js
// ./app.js
import express from 'express';
import { initialize } from 'express-openapi';

const app = express();

initialize({
  app,
  apiDoc: './apiDoc.yml',
  operations: {
    getFoo: function(req, res) {
      res.send('foo');
    }
  }
});

app.listen(3000);
```

Operations also get `args.dependencies` injected as
`this.dependencies` on the function scope. This requires your
operations to be regular [function
expressions](https://developer.mozilla.org/en-US/docs/web/JavaScript/Reference/Operators/function)
and not [arrow
functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
(due to the fact that `this` is lexical to the surrounding scope in an
arrow function and cannot be bound to anything else). x

```js
// ./app.js
import express from 'express';
import { initialize } from 'express-openapi';

const app = express();

initialize({
  app,
  apiDoc: './apiDoc.yml',
  dependencies: {
    log: console.log
  },
  operations: {
    getFoo: function(req, res) {
      this.dependencies.log('calling request handler');
      res.send('foo');
    }
  }
});

app.listen(3000);
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
initialize({
  apiDoc: require('v3-api-doc'),
  /*...*/
  pathSecurity: [
    // here /some/{pathId} will get theirSecurity.
    [/^\/some\/\{pathId\}/, [{mySecurity:[]}]],
    [/^\/some\/\{pathId\}/, [{theirSecurity:[]}]]
  ]
  /*...*/
});
```

#### args.paths

|Type|Required|Description|
|----|--------|-----------|
|String or Array|Y (unless args.operations is provided)|Relative path or paths to the directory or directories that contain your route files or route specifications.|


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

Alternatively, args.paths may contain route specifications of the form
`{ path: '/foo/{id}', module: require('./handlers/foo') }`.

Modules under `args.paths` expose methods.  Methods may either be a method handler
function, or an array of business specific middleware + a method handler function.

`express-openapi` will prepend middleware to this stack based on the parameters
defined in the method's `apiDoc` property.  If no `apidoc` property exists on the
module method, then `express-openapi` will add no additional middleware.

**Note:** Handlers in args.operations will override handlers in args.paths

#### args.pathsIgnore

|Type|Required|Description|
|----|--------|-----------|
|RegExp|N|Paths matching this regular expression will be ignored.|

A common use for this is to ignore spec or test files located in the same folder than the paths, like:

```javascript
initialize({
  apiDoc: apiDoc,
  app: app,
  paths: './api-v1/paths',
  pathsIgnore: new RegExp('\.(spec|test)$')
})
```

#### args.promiseMode

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Boolean|N|false|Allows middleware and path handlers to return promises.|

The following would then be supported:

```
export default function(worldsService) {
  const operations = {
    GET,
    PUT,
  };

  // If using node >= 7.6 you can use async/await.
  async function GET(req, res) {
    const worlds = await worldsService.getWorlds(req.query.worldName);
    if (!worlds.length) {
      throw {
        status: 404,
        message: 'No worlds were found',
      };
    }
    res.status(200).json(worlds);
  }

  // For node < 7.6 you can use plain promises.
  function PUT(req, res) {
    return worldsService.getWorlds(req.query.worldName)
      .then(function(worlds) {
        if (!worlds.length) {
          throw {
            status: 404,
            message: 'No worlds were found',
          };
        }
        res.status(200).json(worlds);
      });
  }

  /* apidocs removed for brevity's sake in this example. */

  return operations;
}
```

#### args.routesGlob

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|String|N|`**/*.js`|Allows different file extensions.|

#### args.routesIndexFileRegExp

|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|RegExp|N|`/(?:index)?\.js$/`|Allows index files to be named differently.|

#### args.securityFilter
|Type|Required|Default Value|Description|
|----|--------|-------------|-----------|
|Function|N|null|Request handler for the api doc route.|

`req.apiDoc` will be set to a copy of the generated api doc and the securityFilter is
free to modify it.  This is useful if you're implementing [Security Filtering](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#security-filtering).

**Note:** You must end the request inside the filter.

```js
initialize({
  /* ... */
  promiseMode: true,
  securityFilter: async (req, res) => {
    // do something, use await, whatever
    if (!req.user) {
      // only show paths to logged in users.
      req.apiDoc.paths = {};
    }
    res.status(200).json(req.apiDoc);
  }
});
```

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
initialize({
  apiDoc: apiDoc,
  app: app,
  securityHandlers: {
    keyScheme: function(req, scopes, definition) {
      /* do something.  You can assign values to req to make them available in
      operation handlers. */
      return Promise.resolve(true);
    },
    passwordScheme: function(req, scopes, definition) {
      /* do something */
      throw {
        status: 401,
        challenge: 'Basic realm=foo',
        message: 'You must authenticate to access foo.'
      };
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

See [openapi-security-handler](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-security-handler)
for more details.

Also see the sample usage in https://github.com/kogosoftwarellc/open-api/blob/master/packages/express-openapi/test/sample-projects/with-securityHandlers/app.js

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
import { initialize } from "express-openapi";

const app = express();

app.use(bodyParser.json());

initialize({
    apiDoc: './api-doc.js',
    app,
    paths: './built/api-paths',
    routesGlob: '**/*.{ts,js}',
    routesIndexFileRegExp: /(?:index)?\.[tj]s$/
});

app.use(((err, req, res, next) => {
    res.status(err.status).json(err);
}) as express.ErrorRequestHandler);

app.listen(3000);
```

In route handler file like `<project>/src/api-paths/users/{id}.ts`:
```typescript

import { Operation } from "express-openapi";

export const parameters = [
  {
    in: 'path',
    name: 'id',
    required: true,
    type: 'integer'
  }
 ];

export const GET: Operation = [
    /* business middleware not expressible by OpenAPI documentation goes here */
    (req, res, next) => {
        res.status(200).json(/* return the user */);
    }
];

GET.apiDoc = {
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

export const POST: Operation = (req, res, next) => {
    /* ... */
}

POST.apiDoc = {
    /* ... */
};
```

## Supported Versions of Node

* `node@<=0.12.x` => `express-openapi@<=1.3.x`
* `node@>0.12.x` => `express-openapi@*`

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

[coveralls-url]: https://coveralls.io/github/kogosoftwarellc/open-api?branch=main
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=main

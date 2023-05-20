# koa-openapi [![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> An unopinionated OpenAPI framework for Koa.

_Notice: This README is a work in progress and is based on [express-openapi's README](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi/).  Consult that in addition to this until this Notice is removed._

## Getting Started

*To see example projects, look at our [test suite](https://github.com/kogosoftwarellc/open-api/tree/master/packages/koa-openapi/test/sample-projects).*

This getting started guide will use the most fundamental concepts of OpenAPI and
`koa-openapi`.

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

    Our `paths` object was empty in the main apiDoc because `koa-openapi` will generate it for us
    based on the location of our path handlers.
    For this example we'll place our path handlers under `api-v1/paths/`.

    Let's create a `worlds` path:

    ```javascript
    // ./api-v1/paths/worlds.js
    export default function(worldsService) {
      let operations = {
        GET
      };

      function GET(ctx, next) {
        ctx.status = 200;
        ctx.body = worldsService.getWorlds(req.query.worldName);
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
    with `koa-openapi`.  Without it `koa-openapi` would do nothing with it.  We
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

1. Initialize your `koa` router with `koa-openapi`

    We'll create our router as usual and we'll initialize it with `koa-openapi`:

    ```javascript
    // ./app.js
    import Koa from 'koa';
    import Router from 'koa-router';
    import bodyParser from 'koa-bodyparser';
    import { initialize } from 'koa-openapi';
    import v1WorldsService from './api-v1/services/worldsService';
    import v1ApiDoc from './api-v1/api-doc';

    const app = new Koa();
    const router = new Router();

    app.use(bodyParser());

    initialize({
      router,
      apiDoc: v1ApiDoc,
      dependencies: {
        worldsService: v1WorldsService
      },
      paths: './api-v1/paths'
    });

    app.use( router.routes() );

    app.listen(3000);
    ```
Our paths are now active and we can test them out with [Swagger UI](http://petstore.swagger.io/).  This getting started guide
didn't cover everything.  For more examples see the [sample projects](https://github.com/kogosoftwarellc/open-api/tree/master/packages/koa-openapi/test/sample-projects) used in our
extensive test suite.


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

[downloads-image]: http://img.shields.io/npm/dm/koa-openapi.svg
[npm-url]: https://npmjs.org/package/koa-openapi
[npm-image]: http://img.shields.io/npm/v/koa-openapi.svg

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=master

[gitter-url]: https://gitter.im/kogosoftwarellc/open-api
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/open-api.png

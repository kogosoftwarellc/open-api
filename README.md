# @open-api [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url]
> A Monorepo of various packages to power OpenAPI in node.

## Quick Start Express

* See [express-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi)&nbsp;&nbsp;&nbsp;[![express-openapi Downloads][express-openapi-downloads-image]][express-openapi-npm-url]

## Quick Start Koa
* See [koa-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/koa-openapi)&nbsp;&nbsp;&nbsp;[![koa-openapi Downloads][koa-openapi-downloads-image]][koa-openapi-npm-url]

## Packages
* [express-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/express-openapi)
* [fetch-openapi](https://github.com/kogosoftwarellc/open-api/tree/master/packages/fetch-openapi)
* [fs-routes](https://github.com/kogosoftwarellc/open-api/tree/master/packages/fs-routes)
* [openapi-default-setter](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-default-setter)
* [openapi-framework](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-framework)
* [openapi-jsonschema-parameters](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-jsonschema-parameters)
* [openapi-request-coercer](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-coercer)
* [openapi-request-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-request-validator)
* [openapi-response-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-response-validator)
* [openapi-schema-validator](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-schema-validator)
* [openapi-types](https://github.com/kogosoftwarellc/open-api/tree/master/packages/openapi-types)

## Development

This monorepo uses lerna for development.  See the root package.json for helpful scripts.

### Typical Workflow for Contributors

Let's say you're working on a package under [./packages](https://github.com/kogosoftwarellc/open-api/tree/master/packages).  Here's what you do:

1. `cd open-api`
1. `npm run bootstrap`
1. `npm t`
1. Make your changes.
  1. _Do not bump the version in package.json._  A maintainer will handle that once your PR is merged.
1. Once you're satisfied with your changes:
  1. Create a new branch `git checkout -b my-branch` (in case you haven't done so already).
  1. `./bin/commit packages/<package_you're_working_on> 'commit message describing your change.  can be multi line here.  just close with a single quote like so:'`
  1. Push your change to your fork
  1. Open a PR.

### bin

Several scripts have been created to aid in the development of this monorepo (see [./bin](./bin)).  They assume that your `$PWD` is the root of the repository.  Here is a brief summary of common actions:

* Commit changes to a package - `./bin/commit packages/<package_to_commit> 'Commit message'` (the commit message will be prepended with the package name e.g. `<package_to_commit>: Commit message`
* These reduce boilerplate and are called from npm scripts in leaf repos.
  * nyc
  * tsc
  * mocha

## LICENSE

```
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
```

[express-openapi-downloads-image]: http://img.shields.io/npm/dm/express-openapi.svg
[express-openapi-npm-url]: https://npmjs.org/package/express-openapi
[koa-openapi-downloads-image]: http://img.shields.io/npm/dm/koa-openapi.svg
[koa-openapi-npm-url]: https://npmjs.org/package/koa-openapi

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=master

[gitter-url]: https://gitter.im/kogosoftwarellc/open-api
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/open-api.png

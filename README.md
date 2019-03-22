# @open-api [![Build Status][travis-image]][travis-url] [![Coveralls Status][coveralls-image]][coveralls-url] [![Gitter chat][gitter-image]][gitter-url] [![Greenkeeper badge](https://badges.greenkeeper.io/kogosoftwarellc/open-api.svg)](https://greenkeeper.io/)
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

_Note:  One of the goals of this monorepo is to support independent package versions.  The author has used other popular options out there (like lerna), and has found independent versioning to behave strangely with them.  Another goal with the current approach is to reduce boilerplate code as much as possible (something tools like lerna don't help with).  The inspiration for the current approach came from [boennemann/alle](https://github.com/boennemann/alle).  The author isn't
married to the current approach, so if you have ideas on how to simplify the development of this monorepo by all means please [open an issue](https://github.com/kogosoftwarellc/open-api/issues/new)._

### Typical Workflow for Contributors

Let's say you're working on a package under [./packages](https://github.com/kogosoftwarellc/open-api/tree/master/packages).  Here's what you do:

1. `cd open-api`
1. `./bin/test packages/<package_you're_working_on>`
1. Make your changes.
  1. _Do not bump the version in package.json._  A maintainer will handle that once your PR is merged.
1. Once you're satisfied with your changes:
  1. Create a new branch `git checkout -b my-branch` (in case you haven't done so already).
  1. `./bin/commit packages/<package_you're_working_on> 'commit message describing your change.  can be multi line here.  just close with a single quote like so:'`
  1. Push your change to your fork
  1. Open a PR.

### bin

Several scripts have been created to aid in the development of this monorepo (see [./bin](./bin)).  They assume that your `$PWD` is the root of the repository.  Here is a brief summary of common actions:

* Testing
  * (Note: `./bin/test` will run `npm i` in the package _prior_ to running the tests)
  * Test a single package - `./bin/test packages/<package_to_test>` (starts the test in watch mode)
  * Test all packages - `./bin/test`
* Commit changes to a package - `./bin/commit packages/<package_to_commit> 'Commit message'` (the commit message will be prepended with the package name e.g. `<package_to_commit>: Commit message`

#### dev-tools
Scripts in this directory wrap common tools, like `nyc`, `tsc`, and `mocha`.  They reduce boilerplate and are called from npm scripts.

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

[travis-url]: https://travis-ci.org/kogosoftwarellc/open-api
[travis-image]: https://api.travis-ci.org/kogosoftwarellc/open-api.svg?branch=master

[coveralls-url]: https://coveralls.io/r/kogosoftwarellc/open-api
[coveralls-image]: https://coveralls.io/repos/github/kogosoftwarellc/open-api/badge.svg?branch=master

[gitter-url]: https://gitter.im/kogosoftwarellc/open-api
[gitter-image]: https://badges.gitter.im/kogosoftwarellc/open-api.png

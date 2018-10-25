# express-openapi Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.1.0 - 2018-10-25
### Added
- `ExpressOpenAPIArgs` now extends `OpenAPIFrameworkArgs`
- `args.enableObjectCoercion`

## 3.0.3 - 2018-10-17
### Fixed
- Typescript documentation in README.
- Adding `Operation` back as an exported type.

## 3.0.2 - 2018-10-12
### Fixed
- Types reference had wrong path in `package.json`.

## 3.0.1 - 2018-10-06
### Added
- Fixing `type: 'file'` breaking OpenAPI V2 request validation.  Downstream projects
  should handle file validation independently.  See #188 and #223.

## 3.0.0 - 2018-10-04
### Added
- project is now built with typescript (#174)
- CHANGELOG.md

### Changed
- `export function initialize` instead of `module.exports = { initialize };`
- `res.validateResponse` no longer has status set.  It's recommended to handle this in your error middleware.
- `securityHandlers` no longer accept a `cb` parameter.  They instead return promises.
- Typings now use declarations from other packages where possible.

### Fixed
- `securityHandlers` no longer return challenge attributes (see #197).

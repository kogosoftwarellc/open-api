# express-openapi Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.1.1 - 2019-01-22
### Fixed
- openapi-framework: Allowing to set a property of BaseSchemaObject as a reference to another SchemaObject (#312)

## 4.1.0 - 2019-01-11
### Fixed
- retrieving validation keywords in both root and schema attribute of a definition for all types of parameters (fixes #301)
- pass schema definitions for OpenApiV3 (#280)
- no request body validation for methods w/o parameters (closes #294)
- Resolve response and parameter references for OpenAPI 3.0 (fixes #293)

## 4.0.0 - 2019-01-09
### Added
- Support for V3 servers attribute (#295)

### Changed
- Security middleware is now executed before other middleware (closes #286)

### Fixed
- openapi-framework@0.18.0:
  - no request body validation for methods w/o parameters (closes #294)
  - Resolve response and parameter references for OpenAPI 3.0 (fixes #293)

## 3.7.0 - 2018-12-31
### Fixed
- openapi-framework@0.16.0: support refs in requestBody schema to both definitions and components.schemas

## 3.6.0 - 2018-12-20
### Fixed
- Updated openapi-framework to handle OpenAPI V3 requestBody and components.

## 3.5.0 - 2018-12-12
### Added
- Updated openapi-framework to 0.13.0 for OpenAPI V3 response application/json validation support.

## 3.4.0 - 2018-12-11
### Added
- Updated openapi-framework to 0.12.0 for OpenAPI V3 response nullable property support.

## 3.3.0 - 2018-11-21
### Added
- Updated openapi-framework to 0.10.0 for OpenAPI V3 request coercion support.

## 3.2.0 - 2018-11-20
### Added
- Updated openapi-framework to 0.9.0 for OpenAPI V3 requestBody.consumes support.

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

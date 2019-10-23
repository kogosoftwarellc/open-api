# openapi-response-validator Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.0.0 - 2019-10-21
### Added
- add 'errors' on any error (fixes #512) (#531)

### Changed
- removes path from message (part of #554) (#556)

### Fixed
- readme renamed instance variable (part of #512) (#527)

## 3.8.2 - 2019-07-12
###
- remove required writeOnly props from resp validation (#481)

## 3.8.1 - 2019-05-13
### Fixed
- Correct nullable transform for null examples (fixes #413)
- Set "useDefaults: true" on Ajv (#409)
- openapi-types
  - Amended missing usage of PathsObject in OpenAPIV3.Document interface (#440)

## 3.7.0 - 2019-01-31
### Fixed
- Deep clone schemas before transforming nullable values. (#324)
- Handle ?XX status codes. (#325)
- openapi-types:
  - Allowing to set a property of BaseSchemaObject as a reference to another SchemaObject (#312)

## 3.6.0 - 2018-12-20
### Fixed
- Making components arg optional and based on OpenAPIV3.ComponentsObject.

## 3.3.0 - 2018-12-12
### Fixed
- Handling application/json schemas for V3.

## 3.2.0 - 2018-12-11
### Fixed
- Handling nullable for V3

## 3.0.1 - 2018-10-03
### Fixed
- Updating .npmignore to publish `dist`

## 3.0.0 - 2018-10-02
### Added
- `export interface IOpenAPIResponseValidator`
- `export interface OpenAPIResponseValidatorArgs`
- `export interface OpenAPIResponseValidatorError`
- `export interface OpenAPIResponseValidatorValidationError`

### Fixed
- Upgraded ajv to `^6.5.4`

### Changed
- `module.exports` to `export default`
- Removed `status` from validation errors.

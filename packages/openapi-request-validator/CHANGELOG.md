# openapi-request-validator Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 4.2.0 - 2019-12-09
### Added
* Adds 'request' to errorCode (fixes #554) (#557)
* Fixes circular $ref (#565)

## 4.1.0 - 2019-10-23
### Added
- openapi-jsonschema-parameters: Added support for 'examples' (fixes #513) (#514)

## 4.0.0 - 2019-10-23
### Changed
- renamed validate function (part of #512) (#541)

### Fixed
- fix example in readme (fixes #516) (#517)
- allow charset on request content-type (#515)

## 3.8.3 - 2019-06-21
### Fixed
- openapi-jsonschema-parameters: Adds example keyword (fixes #455) (#456)

## 3.8.2 - 2019-06-21
### Fixed
- Accept reqBody readOnly in nested properties (#472)

## 3.8.1 - 2019-05-14
### Fixed
- Removing an uneeded console.log statement (#448)

## 3.8.0 - 2019-05-13
### Added
- Logger argument (#61)

### Fixed
- Allowing null enums and nullable option (#433)
accept requestBody with missing readOnly required prop (fixes #389) (#390)
- accept reqBody RO nested ref (fixes #394)
- Setting "useDefaults" to true on Ajv (#409)
- openapi-types
  - Amended missing usage of PathsObject in OpenAPIV3.Document interface (#440)

## 3.7.0 - 2019-03-19
### Fixed
- Allow request validation without parameters (#382)

## 3.6.0 - 2019-01-31
### Fixed
- Handle missing or invalid 'Content-Type' (#326)
- openapi-jsonschema-parameters:
  - openapi-types: OpenAPIV3: relax security requirement object types (#327)
- openapi-types: OpenAPIV3: relax security requirement object types (#327)

## 3.5.0 - 2019-01-11
### Fixed
- retrieving validation keywords in both root and schema attribute of a definition for all types of parameters (fixes #301)

## 3.4.0 - 2019-01-11
### Fixed
- pass schema definitions for OpenApiV3 (#280)

## 3.3.0 - 2019-01-08
### Fixed
- handle multipart/form-data

## 3.2.0 - 2018-12-31
### Added
- support refs in requestBody schema to both definitions and components.schemas

## 3.1.0 - 2018-12-20
### Fixed
- OpenAPIV3 requestBody validation.

## 3.0.1 - 2018-10-06
### Fixed
- `type: 'file'` parameters are now ignored.  Downstream packages should handle
  file validation on their own.

## 3.0.0 - 2018-10-02
### Added
- `export interface IOpenAPIRequestValidator`
- `export interface OpenAPIRequestValidatorArgs`
- `export interface OpenAPIRequestValidatorError`

### Fixed
- Upgraded ajv to `^6.5.4`

### Changed
- `module.exports` to `export default`

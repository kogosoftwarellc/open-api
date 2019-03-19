# openapi-request-validator Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

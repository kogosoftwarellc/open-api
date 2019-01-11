# koa-openapi Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.8.0 - 2019-01-11
### Fixed
- retrieving validation keywords in both root and schema attribute of a definition for all types of parameters (fixes #301)
- pass schema definitions for OpenApiV3 (#280)
- no request body validation for methods w/o parameters (closes #294)
- Resolve response and parameter references for OpenAPI 3.0 (fixes #293)

## 3.7.0 - 2019-01-09
### Added
- Support for V3 servers attribute (#295)

### Fixed
- openapi-framework@0.18.0:
  - no request body validation for methods w/o parameters (closes #294)
  - Resolve response and parameter references for OpenAPI 3.0 (fixes #293)

## 3.6.0 - 2018-12-31
### Fixed
- openapi-framework@0.16.0: support refs in requestBody schema to both definitions and components.schemas

## 3.5.0 - 2018-12-20
### Added
- Updated openapi-framework to handle OpenAPI V3 requestBody and components.

## 3.4.0 - 2018-12-12
### Added
- Updated openapi-framework to 0.13.0 for OpenAPI V3 response application/json validation support.

## 3.3.0 - 2018-12-11
### Added
- Updated openapi-framework to 0.12.0 for OpenAPI V3 response nullable support.

## 3.2.0 - 2018-11-21
### Added
- Updated openapi-framework to 0.10.0 for OpenAPI V3 request coercion support.

## 3.1.0 - 2018-11-20
### Added
- Updated openapi-framework to 0.9.0 for OpenAPI V3 requestBody.consumes support.

## 3.0.0 - 2018-10-25
- Updated `openapi-framework` to accept `args.enableObjectCoercion`.
- express-openapi reference in README.

## 2.0.0 - 2018-10-25 (Deprecated)
_Note: This was from the previous author_

## 0.2.0 - 2018-10-25 (Deprecated)
_Note: This was from the previous author_

## 0.1.0 - 2018-10-25 (Deprecated)
_Note: This was from the previous author_


## 0.0.6 - 2018-10-19
### Fixed
- express-openapi reference in README.

## 0.0.5 - 2018-10-17
### Added
- Getting Started guide in README.

## 0.0.4 - 2018-10-12
### Fixed
- Basic usage tested.

# koa-openapi Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## 3.13.2 - 2019-05-18
### Fixed
- openapi-framework
  - Warning log : Ignoring the 2nd definition (#368)

## 3.13.1 - 2019-05-14
### Fixed
- openapi-request-validator
  - Removing an uneeded console.log statement (#448)

## 3.13.0 - 2019-05-13
### Added
- openapi-request-validator
  - Logger argument (#61)

### Fixed
- reordering createAssignApiDocMiddleware after securityHandler (#429)
- openapi-request-validator
  - Allowing null enums and nullable option (#433)
  accept requestBody with missing readOnly required prop (fixes #389) (#390)
  - accept reqBody RO nested ref (fixes #394)
  - Setting "useDefaults" to true on Ajv (#409)
- openapi-response-validator
  - Correct nullable transform for null examples (fixes #413)
  - Set "useDefaults: true" on Ajv (#409)
- openapi-types
  - Amended missing usage of PathsObject in OpenAPIV3.Document interface (#440)

## 3.12.0 - 2019-03-19
### Added
- openapi-framework: args.logger (#61) (#330)

### Fixed
- openapi-framework:
  - openapi-request-coercer: Don't coerce numbers that cannot be converted i.e. result in NaN (#371)
  - openapi-request-validator: Allow request validation without parameters (#382)
- Set default basePath (issue #376) (#377)

## 3.11.0 - 2019-02-15
### Added
- openapi-framework:
  - Dependency injection for operations (#357)

## 3.10.3 - 2019-02-12
### Fixed
- openapi-framework:
  - Multiple operations in single file creating duplicate routes (#353)

## 3.10.2 - 2019-02-06
### Fixed
- openapi-framework:
  - args.operations resulting in duplicate routes

## 3.10.1 - 2019-02-06
### Fixed
- openapi-framework:
  - Removed string as an acceptable type for args.operations

## 3.10.0 - 2019-02-06
### Added
- openapi-framework:
  - Added experimental support for args.operations (#336)

## 3.9.0 - 2019-01-31
### Fixed
- openapi-framework:
  - add Logger (#61) (#322)
  - Fixes support for args.securityHandlers in OpenAPIV3 (#323)
  - openapi-types: OpenAPIV3: relax security requirement object types (#327)
  - openapi-default-setter:
    - openapi-types: OpenAPIV3: relax security requirement object types (#327)
  - openapi-request-coercer:
    - openapi-types: OpenAPIV3: relax security requirement object types (#327)
  - openapi-request-validator:
    - Handle missing or invalid 'Content-Type' (#326)
    - openapi-jsonschema-parameters:
      - openapi-types: OpenAPIV3: relax security requirement object types (#327)
    - openapi-types: OpenAPIV3: relax security requirement object types (#327)
  - openapi-response-validator:
    - Deep clone schemas before transforming nullable values. (#324)
    - Handle ?XX status codes. (#325)
    - openapi-types: OpenAPIV3: relax security requirement object types (#327)
  - openapi-schema-validator:
    - openapi-types: OpenAPIV3: relax security requirement object types (#327)
  - openapi-security-handler:
    - openapi-types: OpenAPIV3: relax security requirement object types (#327)

## 3.8.1 - 2019-01-22
### Fixed
- openapi-framework: Allowing to set a property of BaseSchemaObject as a reference to another SchemaObject (#312)

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

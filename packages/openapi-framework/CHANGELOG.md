# openapi-framework Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.25.0 - 2019-12-09
### Added
* openapi-request-validator: Adds 'request' to errorCode (fixes #554) (#557)

### Fixed
* openapi-request-coercer: Do not throw on untyped array items (#569)
* openapi-request-coercer: Fix some data driven test names (#575)
* openapi-request-coercer: Fix handling of OAS 3 explode (#574)
* openapi-request-coercer: Drop unused member (#570)
* openapi-request-validator: Fixes circular $ref (#565)

## 0.25.0 - 2019-10-21
### Added
- Add support for $ref in requestBody (closes #486)
- openapi-default-setter: Support default values from schema property in parameter objects (#551)
- openapi-jsonschema-parameters: Added support for 'examples' (fixes #513) (#514)
- openapi-response-validator: add 'errors' on any error (fixes #512) (#531)

### Changed
- openapi-request-validator: renamed validate function (part of #512) (#541)
- openapi-response-validator: removes path from message (part of #554) (#556)

### Fixed
- openapi-response-validator: readme renamed instance variable (part of #512) (#527)

## 0.24.5 - 2019-07-12
### Fixed
- openapi-response-validator: remove required writeOnly props from resp validation (#481)

## 0.24.4 - 2019-06-22
### Fixed
- Suppressing unwanted "Ignoring the 2nd definition" warnings (fixes: #368) (#479)

## 0.24.3 - 2019-06-21
### Fixed
- Update customFormat argument typing (#471)
- Log an improved warning if the operationId of an operation is not specified (fixes #465) (#466)
- openapi-jsonschema-parameters: Adds example keyword (fixes #455) (#456)
- openapi-request-validator: Accept reqBody readOnly in nested properties (#472)

## 0.24.1 - 2019-05-14
### Fixed
- openapi-request-validator
  - Removing an uneeded console.log statement (#448)

## 0.24.0 - 2019-05-13
### Added
- openapi-request-validator
  - Logger argument (#61)

### Fixed
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

## 0.23.0 - 2019-03-19
### Added
- args.logger (#61) (#330)

### Fixed
- openapi-request-coercer: Don't coerce numbers that cannot be converted i.e. result in NaN (#371)
- openapi-request-validator: Allow request validation without parameters (#382)


## 0.22.0 - 2019-02-15
### Added
- Dependency injection for operations (#357)

## 0.21.3 - 2019-02-12
### Fixed
- Multiple operations in single file creating duplicate routes (#353)

## 0.21.2 - 2019-02-06
### Fixed
- args.operations resulting in duplicate routes

## 0.21.1 - 2019-02-06
### Fixed
- Removed string as an acceptable type for args.operations

## 0.21.0 - 2019-02-06
### Added
- Experimental support for args.operations (#336)

## 0.20.0 - 2019-01-31
### Fixed
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

## 0.19.2 - 2019-01-22
### Fixed
- openapi-types: Allowing to set a property of BaseSchemaObject as a reference to another SchemaObject (#312)

## 0.19.0 - 2019-01-11
### Fixed
- retrieving validation keywords in both root and schema attribute of a definition for all types of parameters (fixes #301)
- pass schema definitions for OpenApiV3 (#280)

## 0.18.0 - 2019-01-09
### Fixed
* no request body validation for methods w/o parameters (closes #294)
* Resolve response and parameter references for OpenAPI 3.0 (fixes #293)

## 0.17.0 - 2019-01-08
### Added
* Support for V3 servers attribute (#295)

### Fixed
* openapi-request-validator@3.3.0: handle multipart/form-data
* openapi-response-validator@3.6.0: Allow different content types for V3 response definitions (#292)

## 0.16.0 - 2018-12-31
### Fixed
* openapi-request-validator@3.2.0: support refs in requestBody schema to both definitions and components.schemas

## 0.15.0 - 2018-12-20
### Fixed
* Updating openapi-response-validator to handle V3 components.
* Updating openapi-request-validator to handle V3 requestBody.

## 0.13.0 - 2018-12-12
### Fixed
* Updating openapi-response-validator to handle V3 application/json content.

## 0.12.0 - 2018-12-11
### Fixed
* Updating openapi-response-validator to handle V3 nullable in responses.

## 0.10.0 - 2018-11-21
### Added
* Updating openapi-request-coercer to 2.2.0 for OpenAPI V3 support.

## 0.9.0 - 2018-11-20
### Added
* Support for OpenAPI V3 requestBody.consumes.

## 0.8.2 - 2018-10-25
### Added
* Making `apiDoc` readonly on `OpenAPIFramework`.

## 0.8.1 - 2018-10-25
### Added
* `export OpenAPIFrameworkConstructorArgs`

## 0.8.0 - 2018-10-25
### Added
* Example Usages section in README.

### Changed
- `OpenAPIFrameworkArgs`: `name` and `featureType` were moved to `OpenAPIFrameworkConstructorArgs` internally.  This will allow frameworks to set these properties internally.

## 0.7.0 - 2018-10-24
### Added
- `OpenAPIFrameworkPathObject`

## 0.6.0 - 2018-10-20
### Added
- `OpenAPIFrameworkArgs.enableObjectCoercion`

## 0.5.4 - 2018-10-12
### Added
- Exporting `OpenAPIFrameworkPathContext`, `OpenAPIFrameworkAPIContext`, and `OpenAPIFrameworkOperationContext`

## 0.5.3 - 2018-10-09
### Added
- Exporting `OpenAPIFrameworkArgs`

## 0.5.2 - 2018-10-06
### Fixed
- `type: 'file'` parameters were breaking OpenAPI V2 request validation.  Downstream
  projects should now handle file validation independently.

## 0.5.1 - 2018-10-04
### Changed
- `OpenAPIFrameworkOptions` -> `OpenAPIFrameworkArgs`

### Fixed
- Defining securityHandlers properly.

## 0.5.0 - 2018-10-03
### Changed
- Casing of exported types from `Openapi*` to `OpenAPI*`

### Fixed
- Defined feature types for operation context.
- Updating dependencies to the latest version.

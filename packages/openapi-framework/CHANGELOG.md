# openapi-framework Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.8.2 - 2018-10-25
## Added
* Making `apiDoc` readonly on `OpenAPIFramework`.

## 0.8.1 - 2018-10-25
## Added
* `export OpenAPIFrameworkConstructorArgs`

## 0.8.0 - 2018-10-25
## Added
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

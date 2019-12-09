# openapi-request-coercer Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.4.0 - 2019-12-09
### Fixed
* Do not throw on untyped array items (#569)
* Fix some data driven test names (#575)
* Fix handling of OAS 3 explode (#574)
* Drop unused member (#570)

## 2.3.0 - 2019-03-19
### Fixed
- Don't coerce numbers that cannot be converted (#371)

## 2.2.1 - 2019-01-31
### Added
- openapi-types: OpenAPIV3: relax security requirement object types (#327)

## 2.2.0 - 2018-11-21
### Added
- Adding OpenAPI V3 support.

## 2.1.0 - 2018-10-20
### Added
- `args.enableObjectCoercion` to enable coercion for `type: 'object'` parameters.

## 2.0.1 - 2018-10-03
### Fixed
- Updating .npmignore to publish `dist`

## 2.0.0 - 2018-09-29
### Added
- Exported 2 new interfaces:
  - `IOpenAPIRequestCoercer`
  - `OpenAPIRequestCoercerArgs`

### Changed
- Using `export default` instead of `module.exports`.

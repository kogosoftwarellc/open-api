# openapi-default-setter Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.1.0 - 2019-10-23
### Added
- Support default values from schema property in parameter objects (#551)

## 2.0.4 - 2019-01-31
### Fixed
- openapi-types: OpenAPIV3: relax security requirement object types (#327)

## 2.0.3 - 2018-10-03
### Fixed
- Updating .npmignore to publish `dist`

## 2.0.2 - 2018-10-02
### Added
- CHANGELOG.md
- `export interface IOpenAPIDefaultSetter`

### Changed
- Casing of `api` to `API` in exported interfaces and classes.

### Fixed
- Using `openapi-types@^1.0.2`.  This will allow npm to dedupe.

## 2.0.1 - 2018-09-20
### Fixed
- Updated README

## 2.0.0 - 2018-09-20
### Added
- `export interface OpenapiDefaultSetterArgs`

### Changed
- Moved the project to typescript
- Using `export default` instead of `module.exports`

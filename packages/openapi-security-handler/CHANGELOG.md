# openapi-security-handler Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.4 - 2019-01-31
### Fixed
- openapi-types: Allowing to set a property of BaseSchemaObject as a reference to another SchemaObject (#312)

## 2.0.3 - 2018-10-04
### Fixed
- Added `main` to package.json to fix import

## 2.0.2 - 2018-10-03
### Fixed
- Updating .npmignore to publish `dist`

## 2.0.1 - 2018-10-02
### Fixed
- Casing of `api` to `API` in exported interfaces.

## 2.0.0 - 2018-09-29
### Added
- `export interface IOpenapiSecurityHandler`
- `export interface OpenapiSecurityHandlerArgs`
- `export interface SecurityHandlers`
- `export interface SecurityHandler`
- `export type SecurityScope`
- Typings for exports.

### Changed
- `module.exports = OpenapiSecurityHandler;` has been replaced with `export default class OpenapiSecurityHandler implements IOpenapiSecurityHandler`.

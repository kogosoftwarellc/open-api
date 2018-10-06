# openapi-request-validator Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

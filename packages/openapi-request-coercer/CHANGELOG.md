# openapi-request-coercer Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

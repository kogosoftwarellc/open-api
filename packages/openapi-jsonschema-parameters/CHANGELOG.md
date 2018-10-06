# openapi-jsonschema-parameters Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.3 - 2018-10-06
### Fixed
- Stop outputting parameters of `type: 'file'`.

  This was causing issues in downstream projects that were attempting to use
  these parameters with a jsonschema validator.  `type: 'file'` isn't valid in
  jsonschema, and OpenAPI V3 has entirely removed it as a type.  downstream
  projects should therefore handle file validation independently of the
  schemas outputted by this package.j

## 1.0.2 - 2018-10-03
### Fixed
- Updating .npmignore to publish `dist`

## 1.0.1 - 2018-09-29
### Fixed
- Using `OpenAPI.Parameters` from `openapi-types` instead of duplicated type definition.

## 1.0.0 - 2018-09-29
### Added
- `export interface OpenAPIParametersAsJSONSchema`
- Typings for exports.

### Changed
- `module.exports` has been replaced with `export convertParametersToJSONSchema`

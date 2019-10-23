# openapi-jsonschema-parameters Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.2.0 - 2019-10-21
### Aded
- Added support for 'examples' (fixes #513) (#514)

### Fixed
- remove extra parens from example code (#550)

## 1.1.2 - 2019-06-21
### Fixed
- Adds example keyword (fixes #455) (#456)

## 1.1.1 - 2019-01-31
### Fixed
- openapi-types: OpenAPIV3: relax security requirement object types (#327)

## 1.1.0 - 2019-01-10
### Fixed
- retrieving validation keywords in both root and schema attribute of a definition for all types of parameters (fixes #301)

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

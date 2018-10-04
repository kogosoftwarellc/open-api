# express-openapi Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 3.0.0 - 2018-10-04
### Added
- project is now built with typescript (#174)
- CHANGELOG.md

### Changed
- `export function initialize` instead of `module.exports = { initialize };`
- `res.validateResponse` no longer has status set.  It's recommended to handle this in your error middleware.
- `securityHandlers` no longer accept a `cb` parameter.  They instead return promises.
- Typings now use declarations from other packages where possible.

### Fixed
- `securityHandlers` no longer return challenge attributes (see #197).

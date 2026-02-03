# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2024-01-XX

### Added
- Initial release with three core rules
- `no-non-component-export-in-tsx`: Disallow non-component runtime exports in `.tsx` files
- `no-tsx-import-in-pure-module`: Disallow importing `.tsx` files in pure modules
- `no-heavy-deps-in-pure-module`: Disallow heavy dependencies in pure modules
- Support for ESLint 9+ flat config and ESLint 8 legacy config
- TypeScript path alias resolution support
- Comprehensive documentation in English and Chinese

### Features
- Automatic detection of `.tsx` imports even when file extension is omitted
- Configurable pure module patterns
- Customizable forbidden dependencies and file extensions
- Recommended configuration presets

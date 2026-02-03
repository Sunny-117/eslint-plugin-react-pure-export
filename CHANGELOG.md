## 0.0.3 (2026-02-03)


### Features

* enhance rule documentation and improve test coverage with new test cases ([d8de729](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/d8de72982df109663e7349113ebb054ff1d9f3a1))
* init specs ([0bfe719](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/0bfe719f3d7ecb6d45be1b5535744aa7d40e3579))
* **playground:** add rule verification script and update ESLint setup ([e67bfc3](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/e67bfc3b220cb173a90e4de660cc73c744823ba9))
* **playground:** initialize Vite playground for plugin testing ([b692a4a](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/b692a4a5c706cebfc4577dbbba31769210ef975a))
* **plugin:** implement plugin entry point with legacy and flat configs ([e1e23ff](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/e1e23ff107030706ff6571e2b8554617ffb9abd8))
* **plugin:** resolve circular reference in flat config and setup workspace ([7a003b7](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/7a003b7bdbc9e4dcd853621f34df0e4761e5d39d))
* **react-component-detector:** handle type assertions in React component patterns ([19a5962](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/19a5962946ce313364b624db2b9ccfe7663e6698))
* **rules:** implement no-heavy-deps-in-pure-module rule with tests ([4b6bbae](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/4b6bbaed84d333dda4260cfd50770d3be881f671))
* **rules:** implement no-non-component-export-in-tsx rule with tests ([a5a5ea1](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/a5a5ea1f0cd4e66a677b583fb1c6a797424a6552))
* **rules:** implement no-tsx-import-in-pure-module rule with tests ([8bfffe7](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/8bfffe7c631d78d37c2a3c5de825d3a62e30fb93))
* **tests:** add comprehensive tests for HOC detection in no-non-component-export-in-tsx rule ([001256d](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/001256d54c9811d937c444a248805ecb2b4e97c7))
* **utils:** implement utility functions and tests for AST and file pattern matching ([6d83103](https://github.com/Sunny-117/eslint-plugin-react-pure-export/commit/6d8310308f9ee66814ac0126784d0eecf42bfadc))



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

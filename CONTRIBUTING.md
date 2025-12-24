# Contributing to eslint-plugin-react-pure-export

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Documentation](#documentation)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/Sunny-117/eslint-plugin-react-pure-export.git
   cd eslint-plugin-react-pure-export
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/Sunny-117/eslint-plugin-react-pure-export.git
   ```

## Development Setup

### Prerequisites

- Node.js >= 16.0.0
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install

# Or with npm
npm install
```

### Verify Setup

```bash
# Run all tests
pnpm test

# Run specific test suites
pnpm test:rules
pnpm test:utils
```

## Project Structure

```
eslint-plugin-react-pure-export/
├── lib/                          # Source code
│   ├── rules/                    # ESLint rules
│   │   ├── no-non-component-export-in-tsx.js
│   │   ├── no-tsx-import-in-pure-module.js
│   │   └── no-heavy-deps-in-pure-module.js
│   ├── utils/                    # Utility functions
│   │   ├── ast-helpers.js
│   │   ├── react-component-detector.js
│   │   └── file-pattern-matcher.js
│   └── index.js                  # Plugin entry point
├── tests/                        # Test files
│   ├── rules/                    # Rule tests
│   ├── utils/                    # Utility tests
│   └── integration/              # Integration tests
├── playground/                   # Development playground
│   ├── src/                      # Test files for manual testing
│   └── .eslintrc.cjs            # ESLint config for playground
├── docs/                         # Documentation
│   └── rules/                    # Rule documentation
├── README.md                     # English documentation
├── README_CN.md                  # Chinese documentation
└── CONTRIBUTING.md               # This file
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 2. Make Changes

- Write code following our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed

### 3. Test Your Changes

```bash
# Run all tests
pnpm test

# Run specific test file
node tests/rules/your-rule.test.js

# Test in playground
cd playground
pnpm install
pnpm run dev
```

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve bug in rule"
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Maintenance tasks

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Running Tests

### Run All Tests

```bash
pnpm test
```

### Run Specific Test Suites

```bash
# Rule tests only
pnpm test:rules

# Utility tests only
pnpm test:utils

# Specific test file
node tests/rules/no-non-component-export-in-tsx.test.js
```

### Test Structure

Tests use the ESLint API directly (no external test framework):

```javascript
const { ESLint } = require('eslint');

async function testRule() {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [/* config */]
  });

  const results = await eslint.lintText(code, { filePath: 'test.tsx' });
  
  // Verify results
  if (results[0].messages.length > 0) {
    console.log('✅ PASS: Test case name');
  } else {
    console.log('❌ FAIL: Test case name');
  }
}
```

## Writing Tests

### Unit Tests

Unit tests verify specific functionality:

```javascript
// tests/rules/your-rule.test.js
async function testYourRule() {
  console.log('🧪 Testing your-rule...\n');
  
  const testCases = [
    {
      name: 'Should error on invalid code',
      input: 'export const FOO = 1;',
      shouldError: true
    },
    {
      name: 'Should allow valid code',
      input: 'export const Component = () => <div />;',
      shouldError: false
    }
  ];

  // Run tests...
}
```

### Property-Based Tests

Property tests verify universal properties across many inputs:

```javascript
// tests/rules/your-rule.property.test.js
async function testProperty() {
  console.log('🧪 Property: Description\n');
  
  // Generate 100 random test cases
  for (let i = 0; i < 100; i++) {
    const randomInput = generateRandomInput();
    const results = await eslint.lintText(randomInput, { filePath: 'test.tsx' });
    
    // Verify property holds
    if (!verifyProperty(results)) {
      console.log(`❌ FAIL: Iteration ${i}`);
      return false;
    }
  }
  
  console.log('✅ PASS: All 100 iterations passed');
  return true;
}
```

### Test Guidelines

- Write tests before implementing features (TDD)
- Test both valid and invalid cases
- Include edge cases
- Use descriptive test names
- Keep tests focused and simple
- Aim for high coverage (>90%)

## Submitting Changes

### Pull Request Process

1. **Update Documentation**: Ensure README and rule docs are updated
2. **Add Tests**: All new features must have tests
3. **Run Tests**: Ensure all tests pass
4. **Update Changelog**: Add entry to CHANGELOG.md (if exists)
5. **Create PR**: Submit pull request with clear description

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] New tests added
- [ ] Tested in playground

## Checklist
- [ ] Code follows project style
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No breaking changes (or documented)
```

### Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, your PR will be merged
4. Your contribution will be credited in releases

## Coding Standards

### JavaScript Style

- Use CommonJS modules (`module.exports`, `require`)
- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Use descriptive variable names
- Add JSDoc comments for public functions

### Example:

```javascript
/**
 * Check if a file is a pure module
 * @param {string} filename - The file path
 * @returns {boolean} True if file is a pure module
 */
function isPureModule(filename) {
  const patterns = ['.pure.ts', '.utils.ts', '.config.ts'];
  return patterns.some(pattern => filename.endsWith(pattern));
}

module.exports = {
  isPureModule
};
```

### Rule Implementation

- Follow ESLint rule structure
- Include complete `meta` object
- Provide clear error messages
- Add fixers when possible
- Handle edge cases gracefully

### Error Messages

- Be clear and actionable
- Suggest how to fix the issue
- Use consistent terminology
- Include relevant context

**Good:**
```javascript
messages: {
  nonComponentExport: 'Non-component runtime export "{{name}}" is not allowed in .tsx files. Extract to a separate .ts file.'
}
```

**Bad:**
```javascript
messages: {
  error: 'Invalid export'
}
```

## Documentation

### Rule Documentation

Each rule must have documentation in `docs/rules/`:

- Rule description
- Why the rule exists
- Examples (correct and incorrect)
- Configuration options
- When not to use it
- Related rules

### README Updates

When adding features:

- Update main README.md
- Update Chinese README_CN.md
- Add usage examples
- Update rule list

### Code Comments

- Add JSDoc for public functions
- Explain complex logic
- Document assumptions
- Note edge cases

## Testing in Playground

The playground is a Vite + React + TypeScript project for manual testing:

```bash
cd playground
pnpm install
pnpm run dev
```

**Test Files:**
- `src/components/ValidComponent.tsx` - Should pass all rules
- `src/components/InvalidComponent.tsx` - Should trigger errors
- `src/utils/helpers.pure.ts` - Pure module examples
- `src/utils/invalid.pure.ts` - Should trigger errors

**Verify Rules:**
```bash
cd playground
npx eslint src --ext .ts,.tsx
```

## Getting Help

- **Issues**: Open an issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check README and rule docs first

## Recognition

Contributors will be:
- Listed in GitHub contributors
- Mentioned in release notes
- Credited in the README

Thank you for contributing to eslint-plugin-react-pure-export! 🎉

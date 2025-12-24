# Design Document: eslint-plugin-react-pure-export

## Overview

eslint-plugin-react-pure-export 是一个 ESLint 插件，通过三个核心规则强制执行 React 项目中组件模块与纯逻辑模块的边界分离。插件基于 @typescript-eslint/parser 的 AST 分析能力，支持 ESLint 8 和 ESLint 9+ 的配置格式，使用 pnpm + vitest + vite 构建现代化的开发和测试环境。

## Architecture

### 项目结构

```
eslint-plugin-react-pure-export/
├── lib/
│   ├── rules/
│   │   ├── no-non-component-export-in-tsx.js
│   │   ├── no-tsx-import-in-pure-module.js
│   │   └── no-heavy-deps-in-pure-module.js
│   ├── utils/
│   │   ├── ast-helpers.js
│   │   ├── react-component-detector.js
│   │   └── file-pattern-matcher.js
│   └── index.js
├── tests/
│   ├── rules/
│   │   ├── no-non-component-export-in-tsx.test.js
│   │   ├── no-tsx-import-in-pure-module.test.js
│   │   └── no-heavy-deps-in-pure-module.test.js
│   └── utils/
│       ├── ast-helpers.test.js
│       └── react-component-detector.test.js
├── playground/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── config/
│   ├── .eslintrc.cjs
│   ├── vite.config.js
│   └── package.json
├── docs/
│   ├── rules/
│   │   ├── no-non-component-export-in-tsx.md
│   │   ├── no-tsx-import-in-pure-module.md
│   │   └── no-heavy-deps-in-pure-module.md
│   └── examples/
├── README.md
├── README_CN.md
├── CONTRIBUTING.md
├── LICENSE
└── package.json
```

### 技术栈

- **语言**: JavaScript (纯 JS，无需构建)
- **包管理器**: pnpm
- **测试框架**: 直接使用 ESLint API 进行测试（参考 react-boundary 测试范式）
- **开发环境**: Vite playground
- **ESLint 解析器**: @typescript-eslint/parser
- **运行时**: Node.js CommonJS

## Components and Interfaces

### 1. Plugin Entry Point (lib/index.js)

插件主入口，导出所有规则和推荐配置。

```javascript
// Plugin export structure
module.exports = {
  rules: {
    'no-non-component-export-in-tsx': require('./rules/no-non-component-export-in-tsx'),
    'no-tsx-import-in-pure-module': require('./rules/no-tsx-import-in-pure-module'),
    'no-heavy-deps-in-pure-module': require('./rules/no-heavy-deps-in-pure-module')
  },
  configs: {
    recommended: {
      plugins: ['react-pure-export'],
      rules: {
        'react-pure-export/no-non-component-export-in-tsx': 'error',
        'react-pure-export/no-tsx-import-in-pure-module': 'error',
        'react-pure-export/no-heavy-deps-in-pure-module': 'error'
      }
    }
  }
};
```

**职责**:
- 导出所有规则
- 提供 Legacy Config 和 Flat Config 的推荐配置
- 设置插件元数据

### 2. Rule: no-non-component-export-in-tsx

**文件**: `lib/rules/no-non-component-export-in-tsx.js`

**接口**:
```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow non-component runtime exports in .tsx files',
      recommended: 'error'
    },
    messages: {
      nonComponentExport: 'Non-component runtime export "{{name}}" is not allowed in .tsx files. Extract to a separate .ts file.',
      runtimeEnumExport: 'Runtime enum export "{{name}}" is not allowed in .tsx files. Use type-only enum or extract to a separate .ts file.'
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    // Rule implementation
  }
};
```

**核心逻辑**:
1. 检查文件扩展名是否为 `.tsx`
2. 遍历所有 export 声明节点
3. 对于每个 export，判断是否为：
   - Type export (允许)
   - React component (允许)
   - Runtime export (报错)
4. 提供 fixer 将违规 export 提取到新文件

**AST 节点处理**:
- `ExportNamedDeclaration`: 处理 `export const/function/interface/type`
- `ExportDefaultDeclaration`: 处理 `export default`
- `TSTypeAliasDeclaration`: 识别 type export
- `TSInterfaceDeclaration`: 识别 interface export
- `TSEnumDeclaration`: 区分 type-only enum 和 runtime enum

### 3. Rule: no-tsx-import-in-pure-module

**文件**: `lib/rules/no-tsx-import-in-pure-module.js`

**接口**:
```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow importing .tsx files in pure modules',
      recommended: 'error'
    },
    messages: {
      tsxImportInPureModule: 'Pure module should not depend on .tsx files. Import "{{source}}" is not allowed.'
    },
    schema: []
  },
  create(context) {
    // Rule implementation
  }
};
```

**核心逻辑**:
1. 检查文件名是否匹配 pure module 模式
2. 遍历所有 import 声明
3. 检查 import source 是否以 `.tsx` 结尾
4. 如果匹配，报告错误

**文件模式匹配**:
- `*.pure.ts`
- `*.utils.ts`
- `*.config.ts`

### 4. Rule: no-heavy-deps-in-pure-module

**文件**: `lib/rules/no-heavy-deps-in-pure-module.js`

**接口**:
```javascript
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow heavy dependencies in pure modules',
      recommended: 'error'
    },
    messages: {
      heavyDepInPureModule: 'Pure module should not import heavy dependency "{{source}}". Consider extracting to a separate module.'
    },
    schema: [
      {
        type: 'object',
        properties: {
          forbiddenDeps: { 
            type: 'array', 
            items: { type: 'string' },
            default: ['react', 'react-dom']
          },
          forbiddenExtensions: { 
            type: 'array', 
            items: { type: 'string' },
            default: ['.css', '.less', '.scss']
          }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    // Rule implementation
  }
};
```

**核心逻辑**:
1. 读取配置选项（默认值：react, react-dom, .css, .less, .scss）
2. 检查文件名是否匹配 pure module 模式
3. 遍历所有 import 声明
4. 检查 import source 是否在禁止列表中
5. 如果匹配，报告错误

### 5. Utility: React Component Detector

**文件**: `lib/utils/react-component-detector.js`

**接口**:
```javascript
/**
 * Detect if a node represents a React component
 * @param {Object} node - AST node
 * @returns {boolean}
 */
function isReactComponent(node) {
  return isReactFC(node) || isReactMemo(node) || isReactForwardRef(node);
}

/**
 * Check if node has React.FC type annotation
 */
function isReactFC(node) { /* ... */ }

/**
 * Check if node is wrapped with React.memo
 */
function isReactMemo(node) { /* ... */ }

/**
 * Check if node is wrapped with React.forwardRef
 */
function isReactForwardRef(node) { /* ... */ }

module.exports = {
  isReactComponent,
  isReactFC,
  isReactMemo,
  isReactForwardRef
};
```

**检测策略**:
1. **React.FC 检测**: 检查变量声明的类型注解是否为 `React.FC` 或 `FC`
2. **React.memo 检测**: 检查是否为 `React.memo()` 或 `memo()` 调用表达式
3. **React.forwardRef 检测**: 检查是否为 `React.forwardRef()` 或 `forwardRef()` 调用表达式
4. **JSX 返回值检测**: 检查函数是否返回 JSX 元素

### 6. Utility: AST Helpers

**文件**: `lib/utils/ast-helpers.js`

**接口**:
```javascript
/**
 * Check if export is type-only
 */
function isTypeOnlyExport(node) { /* ... */ }

/**
 * Check if enum is runtime enum
 */
function isRuntimeEnum(node) { /* ... */ }

/**
 * Get exported name from export declaration
 */
function getExportedName(node) { /* ... */ }

/**
 * Get import source string
 */
function getImportSource(node) { /* ... */ }

module.exports = {
  isTypeOnlyExport,
  isRuntimeEnum,
  getExportedName,
  getImportSource
};
```

**功能**:
- 判断 export 是否为 type-only
- 判断 enum 是否为 runtime enum
- 提取 export 的名称
- 提取 import 的 source

### 7. Utility: File Pattern Matcher

**文件**: `lib/utils/file-pattern-matcher.js`

**接口**:
```javascript
/**
 * Check if file is a pure module
 */
function isPureModule(filename) { /* ... */ }

/**
 * Check if file is a .tsx file
 */
function isTsxFile(filename) { /* ... */ }

/**
 * Generic pattern matching
 */
function matchesPattern(filename, pattern) { /* ... */ }

module.exports = {
  isPureModule,
  isTsxFile,
  matchesPattern
};
```

**功能**:
- 检查文件是否为 pure module
- 检查文件是否为 .tsx 文件
- 通用的文件名模式匹配

## Data Models

### ESLint Rule Module

```javascript
// Rule module structure
module.exports = {
  meta: {
    type: 'problem' | 'suggestion' | 'layout',
    docs: {
      description: 'string',
      recommended: 'error' | 'warn' | false,
      url: 'string (optional)'
    },
    messages: {
      messageId: 'message template with {{placeholders}}'
    },
    fixable: 'code' | 'whitespace' | undefined,
    schema: [] // JSON Schema for rule options
  },
  create(context) {
    return {
      // Node type: handler function
      ExportNamedDeclaration(node) { /* ... */ },
      ImportDeclaration(node) { /* ... */ }
    };
  }
};
```

### AST Node Types (from @typescript-eslint/parser)

```javascript
// Export declarations
// ExportNamedDeclaration node structure
{
  type: 'ExportNamedDeclaration',
  declaration: Declaration | null,
  specifiers: ExportSpecifier[],
  source: Literal | null,
  exportKind: 'type' | 'value'
}

// ExportDefaultDeclaration node structure
{
  type: 'ExportDefaultDeclaration',
  declaration: Declaration | Expression
}

// Import declarations
// ImportDeclaration node structure
{
  type: 'ImportDeclaration',
  specifiers: ImportSpecifier[],
  source: Literal,
  importKind: 'type' | 'value'
}

// TypeScript specific
// TSTypeAliasDeclaration node structure
{
  type: 'TSTypeAliasDeclaration',
  id: Identifier,
  typeAnnotation: TSType
}

// TSEnumDeclaration node structure
{
  type: 'TSEnumDeclaration',
  id: Identifier,
  members: TSEnumMember[],
  const: boolean | undefined,
  declare: boolean | undefined
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Non-component runtime exports are rejected in TSX files

*For any* TSX file containing a runtime export (const, function, let, var) that is not a React component, the rule `no-non-component-export-in-tsx` should report an error.

**Validates: Requirements 1.2**

### Property 2: Type exports are allowed in TSX files

*For any* TSX file containing type-only exports (type, interface, type-only enum), the rule `no-non-component-export-in-tsx` should not report any errors.

**Validates: Requirements 1.3, 1.7**

### Property 3: React components are correctly identified

*For any* export in a TSX file that is a React component (React.FC annotation, React.memo wrapper, or React.forwardRef wrapper), the rule `no-non-component-export-in-tsx` should recognize it as a valid component and not report an error.

**Validates: Requirements 1.4, 1.5, 1.6**

### Property 4: Runtime enums are rejected in TSX files

*For any* TSX file containing a runtime enum export (non-const, non-declare enum), the rule `no-non-component-export-in-tsx` should report an error.

**Validates: Requirements 1.8**

### Property 5: Non-exported declarations are ignored

*For any* TSX file containing non-exported declarations (const, function, etc. without export keyword), the rule `no-non-component-export-in-tsx` should not report any errors for those declarations.

**Validates: Requirements 1.9**

### Property 6: All export syntax variants are handled

*For any* valid TypeScript export syntax variant (named export, default export, export with declaration, export from), the rule should correctly parse and evaluate it according to the component/type/runtime classification.

**Validates: Requirements 8.6**

### Property 7: Pure module patterns are recognized

*For any* file whose name matches one of the pure module patterns (*.pure.ts, *.utils.ts, *.config.ts), the rules `no-tsx-import-in-pure-module` and `no-heavy-deps-in-pure-module` should activate and check imports.

**Validates: Requirements 2.1, 2.2, 2.3**

### Property 8: TSX imports are rejected in pure modules

*For any* pure module file that imports a .tsx file, the rule `no-tsx-import-in-pure-module` should report an error with the message "pure module should not depend on tsx".

**Validates: Requirements 2.4**

### Property 9: Non-TSX imports are allowed in pure modules

*For any* pure module file that imports non-.tsx files (.ts, .js, npm packages), the rule `no-tsx-import-in-pure-module` should not report any errors.

**Validates: Requirements 2.5**

### Property 10: Forbidden dependencies are rejected in pure modules

*For any* pure module file that imports a dependency listed in the forbidden dependencies configuration, the rule `no-heavy-deps-in-pure-module` should report an error.

**Validates: Requirements 3.2**

### Property 11: Configuration options are respected

*For any* configuration provided to `no-heavy-deps-in-pure-module` (custom forbidden deps or extensions), the rule should use those values instead of defaults when evaluating imports.

**Validates: Requirements 3.1**

### Property 12: All rules have complete metadata

*For any* rule in the plugin, the rule's meta object should contain a `docs.description` field, a `messages` object with at least one message, and a recommended severity of "error".

**Validates: Requirements 5.1, 5.2, 5.3**

### Property 13: Error messages use predefined message IDs

*For any* error reported by a rule, the message ID used in `context.report()` should exist in the rule's `meta.messages` object.

**Validates: Requirements 5.4**

## Error Handling

### Rule Execution Errors

**Strategy**: Defensive programming with graceful degradation
- If AST parsing fails, skip the file and log a warning
- If file extension cannot be determined, skip the rule
- If configuration is malformed, use default values and warn

**Error Categories**:
1. **Parse Errors**: File cannot be parsed by @typescript-eslint/parser
   - Action: Skip file, do not report rule violations
2. **Configuration Errors**: Invalid rule options provided
   - Action: Use default configuration, log warning
3. **AST Traversal Errors**: Unexpected node structure
   - Action: Skip problematic node, continue with others

### Fixer Errors

**Strategy**: Fail safely without modifying code
- If fixer cannot determine safe extraction location, do not provide fix
- If extracted code would create syntax errors, do not provide fix
- Always validate generated code before suggesting fix

### File System Errors

**Strategy**: Rules should not perform file system operations
- All file path analysis should be based on the filename string provided by ESLint
- No actual file reading or writing during rule execution
- Fixer suggestions are text-based only

## Testing Strategy

### Testing Framework

**Primary Framework**: 直接使用 ESLint API 进行测试（参考 react-boundary 插件测试范式）

**测试方法**:
```javascript
const { ESLint } = require('eslint');

async function testRule() {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{
      files: ['**/*.tsx', '**/*.ts'],
      languageOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        parser: require('@typescript-eslint/parser'),
        parserOptions: {
          ecmaFeatures: { jsx: true }
        }
      },
      plugins: {
        'react-pure-export': require('../index')
      },
      rules: {
        'react-pure-export/no-non-component-export-in-tsx': 'error'
      }
    }],
    fix: true
  });

  const testCases = [
    {
      name: 'Test case name',
      input: `export const PAGE_SIZE = 20;`,
      expectedPattern: /error pattern/,
      filePath: 'test.tsx'
    }
  ];

  for (const testCase of testCases) {
    const results = await eslint.lintText(testCase.input, {
      filePath: testCase.filePath
    });
    
    // Verify results
    if (results[0].messages.length > 0) {
      console.log('✅ PASS:', testCase.name);
    } else {
      console.log('❌ FAIL:', testCase.name);
    }
  }
}
```

**Test Organization**:
```
tests/
├── rules/           # Rule behavior tests
├── utils/           # Utility function tests
└── integration/     # End-to-end plugin tests
```

### Unit Testing

**Scope**: Individual functions and utilities
- AST helper functions
- React component detection logic
- File pattern matching
- Configuration parsing

**Approach**:
- Test specific examples and edge cases
- Use ESLint API directly for rule testing
- Test error conditions (invalid input, malformed AST)

**Example Test Structure**:
```javascript
const { ESLint } = require('eslint');

async function testNoNonComponentExport() {
  console.log('🧪 Testing no-non-component-export-in-tsx rule...\n');
  
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [{
      files: ['**/*.tsx'],
      languageOptions: {
        parser: require('@typescript-eslint/parser'),
        parserOptions: { ecmaFeatures: { jsx: true } }
      },
      plugins: {
        'react-pure-export': require('../index')
      },
      rules: {
        'react-pure-export/no-non-component-export-in-tsx': 'error'
      }
    }]
  });

  const testCases = [
    {
      name: 'Should error on non-component const export',
      input: 'export const PAGE_SIZE = 20;',
      shouldError: true
    },
    {
      name: 'Should allow React.FC component',
      input: 'export const Home: React.FC = () => <div>Home</div>;',
      shouldError: false
    },
    {
      name: 'Should allow type export',
      input: 'export type Status = "active" | "inactive";',
      shouldError: false
    }
  ];

  let allPassed = true;
  for (const testCase of testCases) {
    const results = await eslint.lintText(testCase.input, {
      filePath: 'test.tsx'
    });
    
    const hasError = results[0].messages.length > 0;
    const passed = hasError === testCase.shouldError;
    
    if (passed) {
      console.log(`✅ PASS: ${testCase.name}`);
    } else {
      console.log(`❌ FAIL: ${testCase.name}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

testNoNonComponentExport().catch(console.error);
```

**Test Cases**:
- Empty file handling
- Files with no exports
- Mixed export types
- Edge cases: default exports, re-exports, namespace exports

### Property-Based Testing

**Scope**: Universal properties across all inputs
- Minimum 100 iterations per property test
- Generate random test cases programmatically

**Test Configuration**:
```javascript
// Each property test must reference its design property
// Tag format: Feature: eslint-plugin-react-pure-export, Property N: [property text]

async function testProperty1() {
  console.log('🧪 Property 1: Non-component runtime exports are rejected in TSX files\n');
  
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: [/* ... */],
  });

  // Generate 100 random test cases
  for (let i = 0; i < 100; i++) {
    const randomExport = generateRandomRuntimeExport();
    const results = await eslint.lintText(randomExport, {
      filePath: 'test.tsx'
    });
    
    // Assert: should have error
    if (results[0].messages.length === 0) {
      console.log(`❌ FAIL: Iteration ${i} - Expected error but got none`);
      return false;
    }
  }
  
  console.log('✅ PASS: All 100 iterations passed');
  return true;
}

function generateRandomRuntimeExport() {
  const types = ['const', 'function', 'let', 'var'];
  const type = types[Math.floor(Math.random() * types.length)];
  const name = 'Export' + Math.random().toString(36).substring(7);
  
  if (type === 'function') {
    return `export function ${name}() { return 42; }`;
  } else {
    return `export ${type} ${name} = ${Math.random() * 100};`;
  }
}
```

**Property Test Implementation**:

1. **Property 1 Test**: Generate random TSX files with non-component runtime exports
   - Generator: Create various runtime exports (const, function, let, var) with random names and values
   - Assertion: All should trigger errors from the rule

2. **Property 2 Test**: Generate random TSX files with type-only exports
   - Generator: Create various type exports (type, interface, type-only enum) with random structures
   - Assertion: None should trigger errors

3. **Property 3 Test**: Generate random React component exports
   - Generator: Create components with FC, memo, forwardRef patterns with random props
   - Assertion: None should trigger errors

4. **Property 4 Test**: Generate random runtime enum exports
   - Generator: Create regular enums (not const or declare) with random members
   - Assertion: All should trigger errors

5. **Property 5 Test**: Generate random non-exported declarations
   - Generator: Create declarations without export keyword
   - Assertion: None should trigger errors

6. **Property 6 Test**: Generate random export syntax variants
   - Generator: Create all valid export syntaxes (named, default, with declaration, re-export)
   - Assertion: All should be parsed and classified correctly

7. **Property 7 Test**: Generate random filenames
   - Generator: Create filenames matching and not matching pure module patterns
   - Assertion: Rules activate only for matching patterns

8. **Property 8 Test**: Generate random pure modules with TSX imports
   - Generator: Create pure modules importing .tsx files with random paths
   - Assertion: All should trigger errors

9. **Property 9 Test**: Generate random pure modules with non-TSX imports
   - Generator: Create pure modules importing .ts, .js, npm packages
   - Assertion: None should trigger errors

10. **Property 10 Test**: Generate random pure modules with forbidden deps
    - Generator: Create pure modules importing configured forbidden dependencies
    - Assertion: All should trigger errors

11. **Property 11 Test**: Generate random configurations
    - Generator: Create various configuration objects with different forbidden deps
    - Assertion: Rule behavior matches configuration

12. **Property 12 Test**: Check all rules in the plugin
    - Generator: Iterate through all exported rules
    - Assertion: Each has complete metadata structure (docs.description, messages, recommended)

13. **Property 13 Test**: Generate random rule violations
    - Generator: Create code that triggers various rule violations
    - Assertion: All reported message IDs exist in meta.messages

### Integration Testing

**Scope**: Plugin behavior in real ESLint environment
- Test with actual .eslintrc configurations
- Test with both Legacy Config and Flat Config
- Test in Vite playground with real React project

**Test Scenarios**:
- Plugin installation and configuration
- Running ESLint with plugin enabled
- Verifying error messages in real files
- Testing fixer in real codebase

### Playground Testing

**Purpose**: Manual testing in realistic environment
- Vite + React + TypeScript project
- ESLint configured with the plugin
- Hot module replacement for rapid iteration

**Playground Structure**:
```
playground/
├── src/
│   ├── components/
│   │   ├── ValidComponent.tsx      # Should pass
│   │   └── InvalidComponent.tsx    # Should fail
│   ├── utils/
│   │   ├── helpers.pure.ts         # Pure module
│   │   └── invalid.pure.ts         # Should fail
│   └── config/
│       └── constants.config.ts     # Pure module
├── .eslintrc.cjs                   # ESLint config
└── vite.config.ts
```

### Test Coverage Goals

- **Line Coverage**: > 90%
- **Branch Coverage**: > 85%
- **Function Coverage**: > 95%
- **Property Tests**: All 13 properties implemented

### Continuous Testing

**Development Workflow**:
1. Write failing test (TDD)
2. Implement minimal code to pass test
3. Refactor while keeping tests green
4. Run property tests to verify universal correctness

**CI/CD Integration**:
- Run all tests on every commit
- Run property tests with increased iterations (1000+) in CI
- Fail build if coverage drops below thresholds
- Test against multiple ESLint versions (8.x, 9.x)

## Implementation Notes

### AST Node Identification

**React.FC Detection**:
```javascript
// Check for: export const Component: React.FC = ...
function isReactFC(node) {
  if (node.type !== 'VariableDeclaration') return false;
  
  const declaration = node.declarations[0];
  if (!declaration || !declaration.id.typeAnnotation) return false;
  
  const typeAnnotation = declaration.id.typeAnnotation.typeAnnotation;
  if (typeAnnotation.type !== 'TSTypeReference') return false;
  
  const typeName = typeAnnotation.typeName;
  // Check for React.FC or FC
  if (typeName.type === 'Identifier' && typeName.name === 'FC') return true;
  if (typeName.type === 'TSQualifiedName' && 
      typeName.left.name === 'React' && 
      typeName.right.name === 'FC') return true;
  
  return false;
}
```

**React.memo Detection**:
```javascript
// Check for: export const Component = React.memo(...)
function isReactMemo(node) {
  if (node.type !== 'VariableDeclaration') return false;
  
  const declaration = node.declarations[0];
  if (!declaration || !declaration.init) return false;
  
  const init = declaration.init;
  if (init.type !== 'CallExpression') return false;
  
  const callee = init.callee;
  // Check for React.memo or memo
  if (callee.type === 'Identifier' && callee.name === 'memo') return true;
  if (callee.type === 'MemberExpression' && 
      callee.object.name === 'React' && 
      callee.property.name === 'memo') return true;
  
  return false;
}
```

**Type-only Export Detection**:
```javascript
// Check for: export type { ... } or export { type ... }
function isTypeOnlyExport(node) {
  if (node.type !== 'ExportNamedDeclaration') return false;
  
  // Check exportKind
  if (node.exportKind === 'type') return true;
  
  // Check if all specifiers are type-only
  if (node.specifiers && node.specifiers.length > 0) {
    return node.specifiers.every(spec => spec.exportKind === 'type');
  }
  
  // Check if declaration is a type declaration
  if (node.declaration) {
    const declType = node.declaration.type;
    return declType === 'TSTypeAliasDeclaration' || 
           declType === 'TSInterfaceDeclaration';
  }
  
  return false;
}
```

### Fixer Implementation

**Extraction Strategy**:
1. Identify the exported declaration to extract
2. Generate new filename based on export name (e.g., `PAGE_SIZE` → `page-size.ts`)
3. Create import statement for original file
4. Generate file content with extracted export
5. Provide fix suggestion with code replacement

**Example Fixer**:
```javascript
function provideFix(context, node, exportName) {
  return {
    fix(fixer) {
      // Generate import statement
      const newFileName = exportName
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
      const importStatement = `import { ${exportName} } from './${newFileName}';\n`;
      
      // Remove the export from current file
      const sourceCode = context.getSourceCode();
      const exportText = sourceCode.getText(node);
      
      return [
        fixer.remove(node),
        fixer.insertTextBefore(node, `// TODO: Create ${newFileName}.ts with:\n// ${exportText}\n${importStatement}`)
      ];
    }
  };
}
```

**Limitations**:
- Fixer provides instructions but cannot create new files
- User must manually create the new file
- Fixer validates that removal won't break syntax

### Performance Considerations

**Rule Optimization**:
- Early exit if file extension doesn't match
- Cache component detection results within single file analysis
- Avoid redundant AST traversals

**Memory Management**:
- Do not store entire file contents in memory
- Use streaming AST traversal where possible
- Clear caches after each file analysis

### Compatibility

**ESLint Versions**:
- ESLint 8.x: Use Legacy Config format
- ESLint 9.x: Use Flat Config format
- Both: Export both config formats from plugin

**TypeScript Versions**:
- Minimum: TypeScript 4.5
- Recommended: TypeScript 5.x
- Parser: @typescript-eslint/parser ^6.0.0 || ^7.0.0 || ^8.0.0

**Node Versions**:
- Minimum: Node 16.x
- Recommended: Node 18.x or 20.x
- Use CommonJS module system

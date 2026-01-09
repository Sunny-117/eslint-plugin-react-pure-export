# eslint-plugin-react-pure-export

[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-pure-export.svg)](https://www.npmjs.com/package/eslint-plugin-react-pure-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](./README.md) | 简体中文

一个 ESLint 插件，用于强制分离 React 组件和纯逻辑模块，提高 React Fast Refresh 的稳定性和代码组织性。

## 动机

在 React 项目中，混合组件代码和纯逻辑会导致：

- **React Fast Refresh 问题**：`.tsx` 文件中的非组件导出会破坏热模块替换
- **循环依赖**：组件从导入组件的文件中导入
- **性能问题**：在纯工具模块中加载重型依赖（React、CSS）
- **代码组织混乱**：UI 和业务逻辑之间的边界不清晰

该插件通过三个 ESLint 规则强制执行清晰的分离。

## 安装

```bash
npm install --save-dev eslint-plugin-react-pure-export
# 或
yarn add --dev eslint-plugin-react-pure-export
# 或
pnpm add --save-dev eslint-plugin-react-pure-export
```

**注意**：此插件需要 ESLint 8.0.0 或更高版本以及 `@typescript-eslint/parser`。

## 使用

### ESLint 9+（扁平配置）

```javascript
// eslint.config.js
import reactPureExport from 'eslint-plugin-react-pure-export';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-pure-export': reactPureExport
    },
    rules: {
      'react-pure-export/no-non-component-export-in-tsx': 'error',
      'react-pure-export/no-tsx-import-in-pure-module': 'error',
      'react-pure-export/no-heavy-deps-in-pure-module': 'error'
    }
  }
];
```

或使用推荐配置：

```javascript
// eslint.config.js
import reactPureExport from 'eslint-plugin-react-pure-export';

export default [
  reactPureExport.configs['flat/recommended']
];
```

### ESLint 8 及以下（传统配置）

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ['react-pure-export'],
  rules: {
    'react-pure-export/no-non-component-export-in-tsx': 'error',
    'react-pure-export/no-tsx-import-in-pure-module': 'error',
    'react-pure-export/no-heavy-deps-in-pure-module': 'error'
  }
};
```

或使用推荐配置：

```javascript
// .eslintrc.js
module.exports = {
  extends: ['plugin:react-pure-export/recommended']
};
```

## 规则

### ✅ `no-non-component-export-in-tsx`

禁止在 `.tsx` 文件中导出非组件的运行时代码。

**注意**：包含 JSX 语法的导出是允许的，即使它们不是 React 组件，因为 JSX 需要 `.tsx` 文件。

**❌ 错误示例：**

```tsx
// Button.tsx
export const PAGE_SIZE = 20; // ❌ 不包含 JSX 的非组件导出

export function calculateTotal(a, b) { // ❌ 不包含 JSX 的纯函数
  return a + b;
}

export const Button = () => <button>点击</button>;
```

**✅ 正确示例：**

```tsx
// Button.tsx
export const Button = () => <button>点击</button>; // ✅ 组件导出

export type ButtonProps = { label: string }; // ✅ 类型导出

// ✅ 包含 JSX 的函数是允许的
export function getEditor() {
  return <div>编辑器</div>;
}

// ✅ 包含 JSX 的配置是允许的
export const tableConfig = {
  columns: [
    {
      title: '名称',
      render: (text) => <span>{text}</span>
    }
  ]
};

// ✅ 包含 JSX 的变量是允许的
export const element = <div>你好</div>;
```

[📖 完整文档](./docs/rules/no-non-component-export-in-tsx.md)

---

### ✅ `no-tsx-import-in-pure-module`

禁止在纯模块中导入 `.tsx` 文件。

**默认行为**：所有 `.ts` 文件（包括 `.pure.ts`、`.utils.ts`、`.config.ts` 等）都被视为纯模块。

**特性：**
- ✅ 即使省略文件扩展名也能检测 `.tsx` 导入
- ✅ 支持 TypeScript 路径别名（从 `tsconfig.json` 读取）

**❌ 错误示例：**

```typescript
// helpers.ts 或 helpers.pure.ts
import { Button } from './Button.tsx'; // ❌ 显式 .tsx 导入
import { Button } from './Button'; // ❌ 解析为 Button.tsx
import { Button } from '@/components/Button'; // ❌ 路径别名解析为 Button.tsx
```

**✅ 正确示例：**

```typescript
// helpers.ts
import { formatDate } from './date-utils'; // ✅ 导入 .ts 文件
import { formatDate } from '@/utils/date-utils'; // ✅ 路径别名指向 .ts 文件
import { debounce } from 'lodash'; // ✅ 导入 npm 包
```

**路径别名支持：**

该规则会自动读取 `tsconfig.json` 来解析路径别名。你也可以在 ESLint 配置中指定自定义别名。

**选项 1：自动（从 tsconfig.json）**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

**选项 2：手动（在 ESLint 配置中）**

```javascript
{
  'react-pure-export/no-tsx-import-in-pure-module': ['error', {
    pathAliases: {
      '@': './src',                    // 相对于项目根目录
      '@components': './src/components' // 或使用绝对路径
    }
  }]
}
```

该规则将正确解析：
- `@/components/Button` → `src/components/Button.tsx` ❌
- `@components/Button` → `src/components/Button.tsx` ❌
- `@/utils/helper` → `src/utils/helper.ts` ✅

**配置：**

你可以自定义哪些文件被视为纯模块并指定路径别名：

```javascript
{
  'react-pure-export/no-tsx-import-in-pure-module': ['error', {
    pureModulePatterns: ['*.pure.ts', '*.utils.ts'], // 仅检查这些特定模式
    pathAliases: {                                    // 可选：自定义路径别名
      '@': './src',
      '@components': './src/components'
    }
  }]
}
```

[📖 完整文档](./docs/rules/no-tsx-import-in-pure-module.md)

---

### ✅ `no-heavy-deps-in-pure-module`

禁止在纯模块中使用重型依赖（React、CSS 文件）。

**❌ 错误示例：**

```typescript
// helpers.ts
import React from 'react'; // ❌ 在纯模块中使用 React
import './styles.css'; // ❌ 在纯模块中使用 CSS
```

**✅ 正确示例：**

```typescript
// helpers.ts
export const formatCurrency = (amount: number) => `${amount.toFixed(2)}`;
```

**配置：**

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    pureModulePatterns: ['*.pure.ts', '*.utils.ts'], // 仅检查这些特定模式
    forbiddenDeps: ['react', 'react-dom', 'vue'], // 自定义禁止的包
    forbiddenExtensions: ['.css', '.less', '.scss', '.sass'] // 自定义禁止的扩展名
  }]
}
```

[📖 完整文档](./docs/rules/no-heavy-deps-in-pure-module.md)

## 什么是纯模块？

纯模块是仅包含业务逻辑、工具函数或配置而不包含 UI 依赖的文件。

**默认行为**：默认情况下，所有 `.ts` 文件（包括 `.pure.ts`、`.utils.ts`、`.config.ts` 等）都被视为纯模块。

**自定义模式**：你可以使用 `pureModulePatterns` 选项配置哪些文件被视为纯模块：

```javascript
{
  'react-pure-export/no-tsx-import-in-pure-module': ['error', {
    pureModulePatterns: ['*.pure.ts', '*.utils.ts'] // 仅检查这些特定模式
  }]
}
```

常见模式：
- `*.ts` - 所有以 .ts 结尾的 TypeScript 文件（默认，匹配 helpers.ts、helpers.pure.ts 等）
- `*.pure.ts` - 仅纯逻辑模块
- `*.utils.ts` - 仅工具函数
- `*.config.ts` - 仅配置文件

**优势：**
- 更快的加载速度（无 React/CSS 开销）
- 更好的可测试性
- 更清晰的代码组织
- 改进的 tree-shaking

## 贡献

欢迎贡献！请阅读我们的[贡献指南](./CONTRIBUTING.md)了解我们的开发流程以及如何提交拉取请求的详细信息。

## 许可证

MIT © [eslint-plugin-react-pure-export 贡献者](https://github.com/Sunny-117/eslint-plugin-react-pure-export/graphs/contributors)


## 相关项目

- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)

# eslint-plugin-react-pure-export

[![npm version](https://img.shields.io/npm/v/eslint-plugin-react-pure-export.svg)](https://www.npmjs.com/package/eslint-plugin-react-pure-export)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

一个 ESLint 插件，用于强制执行 React 组件与纯逻辑模块的分离，提升 React Fast Refresh 稳定性和代码组织性。

[English Documentation](./README.md)

## 动机

在 React 项目中，将组件代码与纯逻辑混合会导致：

- **React Fast Refresh 问题**：`.tsx` 文件中的非组件导出会破坏热模块替换
- **循环依赖**：组件从导入组件的文件中导入
- **性能问题**：纯工具模块中加载重量级依赖（React、CSS）
- **代码组织混乱**：UI 和业务逻辑之间的边界不清晰

本插件通过三个 ESLint 规则强制执行清晰的分离。

## 安装

```bash
npm install --save-dev eslint-plugin-react-pure-export
# 或
yarn add --dev eslint-plugin-react-pure-export
# 或
pnpm add --save-dev eslint-plugin-react-pure-export
```

**注意**：本插件需要 ESLint 8.0.0 或更高版本以及 `@typescript-eslint/parser`。

## 使用方法

### ESLint 9+ (Flat Config)

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

### ESLint 8 及以下 (Legacy Config)

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

**❌ 错误示例：**

```tsx
// Button.tsx
export const PAGE_SIZE = 20; // ❌ 非组件导出

export const Button = () => <button>点击</button>;
```

**✅ 正确示例：**

```tsx
// Button.tsx
export const Button = () => <button>点击</button>; // ✅ 组件导出
export type ButtonProps = { label: string }; // ✅ 类型导出
```

**规则详情：**

此规则确保 `.tsx` 文件只导出 React 组件和类型定义，保持组件文件职责单一。

**允许的导出：**
- React 组件（React.FC、React.memo、React.forwardRef）
- 类型定义（type、interface）
- 类型枚举（const enum、declare enum）

**禁止的导出：**
- 常量（const、let、var）
- 函数（非组件函数）
- 运行时枚举（runtime enum）

**自动修复：**

规则提供自动修复建议，将违规导出提取到单独的 `.ts` 文件中。

[📖 完整文档](./docs/rules/no-non-component-export-in-tsx.md)

---

### ✅ `no-tsx-import-in-pure-module`

禁止在纯模块（匹配 `*.pure.ts`、`*.utils.ts` 或 `*.config.ts` 的文件）中导入 `.tsx` 文件。

**❌ 错误示例：**

```typescript
// helpers.pure.ts
import { Button } from './Button.tsx'; // ❌ 在纯模块中导入 .tsx
```

**✅ 正确示例：**

```typescript
// helpers.pure.ts
import { formatDate } from './date-utils'; // ✅ 导入 .ts 文件
import { debounce } from 'lodash'; // ✅ 导入 npm 包
```

**规则详情：**

此规则防止纯逻辑模块依赖 UI 组件，保持模块边界清晰，避免循环依赖。

**纯模块识别模式：**
- `*.pure.ts` - 纯逻辑模块
- `*.utils.ts` - 工具函数
- `*.config.ts` - 配置文件

[📖 完整文档](./docs/rules/no-tsx-import-in-pure-module.md)

---

### ✅ `no-heavy-deps-in-pure-module`

禁止在纯模块中引入重量级依赖（React、CSS 文件）。

**❌ 错误示例：**

```typescript
// helpers.pure.ts
import React from 'react'; // ❌ 在纯模块中使用 React
import './styles.css'; // ❌ 在纯模块中导入 CSS
```

**✅ 正确示例：**

```typescript
// helpers.pure.ts
export const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
```

**配置选项：**

```javascript
{
  'react-pure-export/no-heavy-deps-in-pure-module': ['error', {
    forbiddenDeps: ['react', 'react-dom', 'vue'], // 自定义禁止的包
    forbiddenExtensions: ['.css', '.less', '.scss', '.sass'] // 自定义禁止的扩展名
  }]
}
```

**默认配置：**
- 禁止的依赖：`react`、`react-dom`
- 禁止的扩展名：`.css`、`.less`、`.scss`

**规则详情：**

此规则确保纯模块保持轻量，不引入 UI 框架或样式文件，提升加载性能和代码可测试性。

[📖 完整文档](./docs/rules/no-heavy-deps-in-pure-module.md)

## 什么是纯模块？

纯模块是只包含业务逻辑、工具函数或配置的文件，不包含 UI 依赖。通过命名模式识别：

- `*.pure.ts` - 纯逻辑模块
- `*.utils.ts` - 工具函数
- `*.config.ts` - 配置文件

**优势：**
- 更快的加载速度（无 React/CSS 开销）
- 更好的可测试性
- 更清晰的代码组织
- 改进的 tree-shaking

## 最佳实践

### 1. 组件文件结构

```
src/
├── components/
│   ├── Button.tsx          # 只导出组件和类型
│   ├── Button.types.ts     # 复杂类型定义
│   └── button-helpers.ts   # 组件相关的工具函数
├── utils/
│   ├── format.pure.ts      # 纯工具函数
│   └── validation.utils.ts # 验证工具
└── config/
    └── constants.config.ts # 配置常量
```

### 2. 提取常量

**之前：**
```tsx
// Button.tsx
export const BUTTON_SIZES = ['small', 'medium', 'large']; // ❌
export const Button = () => <button>Click</button>;
```

**之后：**
```typescript
// button-constants.ts
export const BUTTON_SIZES = ['small', 'medium', 'large']; // ✅
```

```tsx
// Button.tsx
import { BUTTON_SIZES } from './button-constants';
export const Button = () => <button>Click</button>; // ✅
```

### 3. 分离业务逻辑

**之前：**
```tsx
// UserProfile.tsx
export const validateEmail = (email: string) => { /* ... */ }; // ❌
export const UserProfile = () => { /* ... */ };
```

**之后：**
```typescript
// validation.utils.ts
export const validateEmail = (email: string) => { /* ... */ }; // ✅
```

```tsx
// UserProfile.tsx
import { validateEmail } from '../utils/validation.utils';
export const UserProfile = () => { /* ... */ }; // ✅
```

## 常见问题

### Q: 为什么不能在 .tsx 文件中导出常量？

A: 非组件导出会导致 React Fast Refresh 失效。当你修改组件时，整个模块会重新加载，导致状态丢失。

### Q: 如何处理组件相关的类型定义？

A: 类型定义可以在 .tsx 文件中导出，因为它们在编译后会被移除，不影响运行时。

### Q: 可以自定义纯模块的命名模式吗？

A: 目前插件使用固定的命名模式（`*.pure.ts`、`*.utils.ts`、`*.config.ts`）。如果需要自定义，欢迎提交 issue 或 PR。

### Q: 规则会影响性能吗？

A: 不会。规则只在 lint 阶段运行，不影响运行时性能。反而通过强制模块分离，可以提升应用性能。

## 贡献

欢迎贡献！请阅读我们的[贡献指南](./CONTRIBUTING.md)了解开发流程和如何提交 Pull Request。

## 许可证

MIT © [eslint-plugin-react-pure-export 贡献者](https://github.com/Sunny-117/eslint-plugin-react-pure-export/graphs/contributors)

## 相关项目

- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)

## 更新日志

查看 [CHANGELOG.md](./CHANGELOG.md) 了解版本更新历史。

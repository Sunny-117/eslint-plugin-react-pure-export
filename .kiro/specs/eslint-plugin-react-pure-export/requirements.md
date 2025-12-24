# Requirements Document

## Introduction

本文档定义了 eslint-plugin-react-pure-export 插件的需求规格。该插件旨在约束 React 项目中组件模块与纯逻辑模块的边界，通过 ESLint 规则强制执行模块职责分离，从而提升性能和 React Fast Refresh 的稳定性。

## Glossary

- **Plugin**: eslint-plugin-react-pure-export ESLint 插件系统
- **Rule**: ESLint 规则，用于检测和报告代码问题
- **TSX_File**: 扩展名为 `.tsx` 的 TypeScript React 文件
- **Pure_Module**: 文件名匹配 `*.pure.ts`、`*.utils.ts` 或 `*.config.ts` 模式的纯逻辑模块
- **React_Component**: React 组件，包括 React.FC、memo 包裹的组件、forwardRef 返回值
- **Runtime_Export**: 运行时代码导出，包括 const、function、let、var 声明
- **Type_Export**: 类型导出，包括 type、interface、type-only enum
- **AST**: Abstract Syntax Tree，抽象语法树
- **Fixer**: ESLint 自动修复功能

## Requirements

### Requirement 1: 实现 no-non-component-export-in-tsx 规则

**User Story:** 作为前端开发者，我希望 `.tsx` 文件只导出 React 组件和类型定义，这样可以确保组件文件职责单一，提升 React Fast Refresh 的稳定性。

#### Acceptance Criteria

1. WHEN THE Rule 分析 TSX_File THEN THE Rule SHALL 识别所有 export 声明
2. WHEN THE Rule 检测到 Runtime_Export 且该导出不是 React_Component THEN THE Rule SHALL 报告错误
3. WHEN THE Rule 检测到 Type_Export THEN THE Rule SHALL 允许该导出
4. WHEN THE Rule 检测到 React.FC 类型注解的导出 THEN THE Rule SHALL 识别为 React_Component
5. WHEN THE Rule 检测到 React.memo 包裹的导出 THEN THE Rule SHALL 识别为 React_Component
6. WHEN THE Rule 检测到 React.forwardRef 包裹的导出 THEN THE Rule SHALL 识别为 React_Component
7. WHEN THE Rule 检测到 type-only enum 导出 THEN THE Rule SHALL 允许该导出
8. WHEN THE Rule 检测到 runtime enum 导出 THEN THE Rule SHALL 报告错误
9. WHEN THE Rule 检测到非导出的常量声明 THEN THE Rule SHALL 忽略该声明
10. WHEN THE Rule 提供 fixer 功能 THEN THE Fixer SHALL 能够将违规导出提取到单独文件

### Requirement 2: 实现 no-tsx-import-in-pure-module 规则

**User Story:** 作为前端开发者，我希望纯逻辑模块不依赖 `.tsx` 文件，这样可以保持模块边界清晰，避免循环依赖和性能问题。

#### Acceptance Criteria

1. WHEN THE Rule 分析文件名匹配 `*.pure.ts` 模式的文件 THEN THE Rule SHALL 检查该文件的 import 语句
2. WHEN THE Rule 分析文件名匹配 `*.utils.ts` 模式的文件 THEN THE Rule SHALL 检查该文件的 import 语句
3. WHEN THE Rule 分析文件名匹配 `*.config.ts` 模式的文件 THEN THE Rule SHALL 检查该文件的 import 语句
4. WHEN THE Rule 检测到 Pure_Module 中 import 了 `.tsx` 文件 THEN THE Rule SHALL 报告错误并提示 "pure module should not depend on tsx"
5. WHEN THE Rule 检测到 Pure_Module 中 import 了非 `.tsx` 文件 THEN THE Rule SHALL 允许该 import

### Requirement 3: 实现 no-heavy-deps-in-pure-module 规则

**User Story:** 作为前端开发者，我希望纯逻辑模块不引入重量级依赖（如 React、样式文件），这样可以减少模块体积，提升加载性能。

#### Acceptance Criteria

1. WHEN THE Rule 配置了禁止依赖列表 THEN THE Rule SHALL 读取配置项
2. WHEN THE Rule 检测到 Pure_Module 中 import 了配置中的禁止依赖 THEN THE Rule SHALL 报告错误
3. WHEN THE Rule 检测到 Pure_Module 中 import 了 `react` THEN THE Rule SHALL 报告错误
4. WHEN THE Rule 检测到 Pure_Module 中 import 了 `react-dom` THEN THE Rule SHALL 报告错误
5. WHEN THE Rule 检测到 Pure_Module 中 import 了 `.css` 文件 THEN THE Rule SHALL 报告错误
6. WHEN THE Rule 检测到 Pure_Module 中 import 了 `.less` 文件 THEN THE Rule SHALL 报告错误
7. WHEN THE Rule 检测到 Pure_Module 中 import 了 `.scss` 文件 THEN THE Rule SHALL 报告错误
8. WHEN THE Rule 配置为空列表 THEN THE Rule SHALL 使用默认禁止依赖列表

### Requirement 4: 插件架构和导出

**User Story:** 作为 ESLint 用户，我希望能够轻松安装和配置该插件，这样可以快速集成到现有项目中。

#### Acceptance Criteria

1. THE Plugin SHALL 导出所有规则通过 `rules` 对象
2. THE Plugin SHALL 支持 ESLint 9+ Flat Config 配置格式
3. THE Plugin SHALL 支持 ESLint 8 及以下 Legacy Config 配置格式
4. WHEN 用户安装插件 THEN THE Plugin SHALL 提供 `recommended` 配置预设
5. THE Plugin SHALL 使用 @typescript-eslint/parser 解析 TypeScript 代码

### Requirement 5: 规则元数据和文档

**User Story:** 作为开发者，我希望每个规则都有清晰的文档和错误信息，这样可以快速理解和修复问题。

#### Acceptance Criteria

1. WHEN THE Rule 定义 meta 对象 THEN THE Rule SHALL 包含 `docs.description` 字段
2. WHEN THE Rule 定义 meta 对象 THEN THE Rule SHALL 包含 `messages` 字段
3. WHEN THE Rule 设置推荐级别 THEN THE Rule SHALL 设置为 "error"
4. WHEN THE Rule 报告错误 THEN THE Rule SHALL 使用 meta.messages 中定义的消息
5. THE Rule SHALL 在 meta.docs 中提供规则的详细说明

### Requirement 6: 测试和开发环境

**User Story:** 作为插件开发者，我希望有完善的测试和开发环境，这样可以确保插件质量和快速迭代。

#### Acceptance Criteria

1. THE Plugin SHALL 使用 pnpm 作为包管理器
2. THE Plugin SHALL 使用 vitest 作为测试框架
3. WHEN 开发者运行测试 THEN THE Plugin SHALL 执行所有单元测试
4. THE Plugin SHALL 提供 Vite playground 用于真实项目测试
5. WHEN 开发者修改代码 THEN THE Playground SHALL 支持热更新
6. THE Plugin SHALL 遵循 TDD 开发模式

### Requirement 7: 项目结构和开源规范

**User Story:** 作为开源贡献者，我希望项目遵循开源规范，这样可以方便理解和贡献代码。

#### Acceptance Criteria

1. THE Plugin SHALL 提供英文 README.md 文件
2. THE Plugin SHALL 提供中文 README_CN.md 文件
3. THE Plugin SHALL 在英文 README 中链接到中文 README
4. THE Plugin SHALL 提供 LICENSE 文件
5. THE Plugin SHALL 提供 CONTRIBUTING.md 指南
6. THE Plugin SHALL 提供清晰的目录结构
7. THE Plugin SHALL 在 package.json 中定义正确的入口点
8. THE Plugin SHALL 提供使用示例和配置说明

### Requirement 8: AST 解析和类型检测

**User Story:** 作为规则实现者，我希望能够准确解析 TypeScript AST 并识别 React 组件，这样可以正确执行规则检查。

#### Acceptance Criteria

1. WHEN THE Rule 解析 export 语句 THEN THE Rule SHALL 使用 @typescript-eslint/parser 的 AST
2. WHEN THE Rule 检测 React.FC 类型 THEN THE Rule SHALL 识别 TSTypeReference 节点
3. WHEN THE Rule 检测 React.memo 调用 THEN THE Rule SHALL 识别 CallExpression 节点
4. WHEN THE Rule 检测 React.forwardRef 调用 THEN THE Rule SHALL 识别 CallExpression 节点
5. WHEN THE Rule 检测 type-only enum THEN THE Rule SHALL 检查 `declare` 关键字或 `const enum`
6. WHEN THE Rule 遍历 AST 节点 THEN THE Rule SHALL 正确处理所有 export 语法变体

# Implementation Plan: eslint-plugin-react-pure-export

## Overview

本实现计划将 eslint-plugin-react-pure-export 插件分解为一系列增量开发任务。每个任务都是独立的编码步骤，按照 TDD 方式开发，先编写测试，再实现功能。所有代码使用纯 JavaScript（无需构建），测试使用 ESLint API 直接进行。

## Tasks

- [x] 1. 初始化项目结构和配置文件
  - 创建项目目录结构（lib/, tests/, playground/, docs/）
  - 创建 package.json 并配置依赖项
  - 创建 .gitignore 和 .npmignore
  - 创建 LICENSE 文件（MIT）
  - _Requirements: 7.4, 7.6, 7.7_

- [x] 2. 实现工具函数模块
  - [x] 2.1 实现文件模式匹配工具（file-pattern-matcher.js）
    - 实现 isPureModule() 函数，检查文件名是否匹配 *.pure.ts, *.utils.ts, *.config.ts
    - 实现 isTsxFile() 函数，检查文件扩展名是否为 .tsx
    - 实现 matchesPattern() 通用模式匹配函数
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 2.2 编写文件模式匹配工具的测试
    - **Property 7: Pure module patterns are recognized**
    - **Validates: Requirements 2.1, 2.2, 2.3**
    - 生成随机文件名，验证模式匹配的正确性
    - 测试边界情况：空字符串、特殊字符、路径分隔符

  - [x] 2.3 实现 AST 辅助函数（ast-helpers.js）
    - 实现 isTypeOnlyExport() 函数，判断 export 是否为 type-only
    - 实现 isRuntimeEnum() 函数，判断 enum 是否为 runtime enum
    - 实现 getExportedName() 函数，提取 export 的名称
    - 实现 getImportSource() 函数，提取 import 的 source
    - _Requirements: 1.1, 1.7, 1.8, 8.5_

  - [x] 2.4 编写 AST 辅助函数的单元测试
    - 测试 isTypeOnlyExport 对各种 export 语法的识别
    - 测试 isRuntimeEnum 区分 const enum、declare enum 和 runtime enum
    - 测试 getExportedName 提取各种 export 形式的名称
    - 测试 getImportSource 提取 import source 字符串
    - _Requirements: 1.1, 1.7, 1.8_

  - [x] 2.5 实现 React 组件检测器（react-component-detector.js）
    - 实现 isReactFC() 函数，检测 React.FC 类型注解
    - 实现 isReactMemo() 函数，检测 React.memo 包裹
    - 实现 isReactForwardRef() 函数，检测 React.forwardRef 包裹
    - 实现 isReactComponent() 函数，综合判断是否为 React 组件
    - _Requirements: 1.4, 1.5, 1.6_

  - [x] 2.6 编写 React 组件检测器的测试
    - **Property 3: React components are correctly identified**
    - **Validates: Requirements 1.4, 1.5, 1.6**
    - 生成随机 React 组件（FC、memo、forwardRef），验证都能被正确识别
    - 测试边界情况：嵌套组件、泛型组件、高阶组件

- [x] 3. 实现 no-non-component-export-in-tsx 规则
  - [x] 3.1 创建规则骨架和元数据
    - 创建 lib/rules/no-non-component-export-in-tsx.js
    - 定义 meta 对象（type, docs, messages, fixable, schema）
    - 实现 create 函数骨架，返回空的 visitor 对象
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 3.2 实现规则核心逻辑
    - 实现文件扩展名检查（仅对 .tsx 文件生效）
    - 实现 ExportNamedDeclaration visitor，检测 named export
    - 实现 ExportDefaultDeclaration visitor，检测 default export
    - 集成 React 组件检测器和 AST 辅助函数
    - 对非组件的运行时 export 调用 context.report()
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.8_

  - [x] 3.3 编写规则的基础单元测试
    - 测试规则只对 .tsx 文件生效
    - 测试非组件 const export 会报错
    - 测试非组件 function export 会报错
    - 测试 React.FC 组件不会报错
    - 测试 type/interface export 不会报错
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 3.4 编写规则的属性测试
    - **Property 1: Non-component runtime exports are rejected in TSX files**
    - **Validates: Requirements 1.2**
    - 生成 100 个随机非组件运行时 export，验证都会报错
    
    - **Property 2: Type exports are allowed in TSX files**
    - **Validates: Requirements 1.3, 1.7**
    - 生成 100 个随机 type-only export，验证都不会报错
    
    - **Property 4: Runtime enums are rejected in TSX files**
    - **Validates: Requirements 1.8**
    - 生成 100 个随机 runtime enum，验证都会报错
    
    - **Property 5: Non-exported declarations are ignored**
    - **Validates: Requirements 1.9**
    - 生成 100 个随机非 export 声明，验证都不会报错
    
    - **Property 6: All export syntax variants are handled**
    - **Validates: Requirements 8.6**
    - 生成各种 export 语法变体，验证都能正确解析和分类

  - [x] 3.5 实现 fixer 功能
    - 实现 fix 函数，生成提取建议
    - 生成新文件名（kebab-case 转换）
    - 生成 import 语句和 TODO 注释
    - _Requirements: 1.10_

  - [x] 3.6 编写 fixer 的单元测试
    - 测试 fixer 生成正确的文件名
    - 测试 fixer 生成正确的 import 语句
    - 测试 fixer 生成的代码不会破坏语法
    - _Requirements: 1.10_

- [x] 4. 实现 no-tsx-import-in-pure-module 规则
  - [x] 4.1 创建规则骨架和元数据
    - 创建 lib/rules/no-tsx-import-in-pure-module.js
    - 定义 meta 对象（type, docs, messages, schema）
    - 实现 create 函数骨架
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 4.2 实现规则核心逻辑
    - 实现文件名模式检查（使用 file-pattern-matcher）
    - 实现 ImportDeclaration visitor
    - 检查 import source 是否以 .tsx 结尾
    - 对 .tsx import 调用 context.report()
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 4.3 编写规则的单元测试
    - 测试规则只对 pure module 文件生效
    - 测试 import .tsx 文件会报错
    - 测试 import .ts 文件不会报错
    - 测试 import npm 包不会报错
    - 测试错误消息包含 "pure module should not depend on tsx"
    - _Requirements: 2.4, 2.5_

  - [x] 4.4 编写规则的属性测试
    - **Property 8: TSX imports are rejected in pure modules**
    - **Validates: Requirements 2.4**
    - 生成 100 个随机 pure module 文件，导入随机 .tsx 文件，验证都会报错
    
    - **Property 9: Non-TSX imports are allowed in pure modules**
    - **Validates: Requirements 2.5**
    - 生成 100 个随机 pure module 文件，导入随机非 .tsx 文件，验证都不会报错

- [x] 5. 实现 no-heavy-deps-in-pure-module 规则
  - [x] 5.1 创建规则骨架和元数据
    - 创建 lib/rules/no-heavy-deps-in-pure-module.js
    - 定义 meta 对象（type, docs, messages, schema）
    - 定义 schema 支持 forbiddenDeps 和 forbiddenExtensions 配置
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 5.2 实现规则核心逻辑
    - 实现配置读取，设置默认值（react, react-dom, .css, .less, .scss）
    - 实现文件名模式检查
    - 实现 ImportDeclaration visitor
    - 检查 import source 是否在禁止列表中
    - 检查 import source 扩展名是否在禁止扩展名列表中
    - 对禁止的 import 调用 context.report()
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 5.3 编写规则的单元测试
    - 测试规则只对 pure module 文件生效
    - 测试 import react 会报错
    - 测试 import react-dom 会报错
    - 测试 import .css 文件会报错
    - 测试 import .less 文件会报错
    - 测试 import .scss 文件会报错
    - 测试自定义配置生效
    - 测试空配置使用默认值
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 5.4 编写规则的属性测试
    - **Property 10: Forbidden dependencies are rejected in pure modules**
    - **Validates: Requirements 3.2**
    - 生成 100 个随机 pure module 文件，导入随机禁止依赖，验证都会报错
    
    - **Property 11: Configuration options are respected**
    - **Validates: Requirements 3.1**
    - 生成 100 个随机配置，验证规则行为符合配置

- [x] 6. 创建插件入口和配置
  - [x] 6.1 实现插件主入口（lib/index.js）
    - 导出所有规则（rules 对象）
    - 创建 recommended 配置（Legacy Config 格式）
    - 创建 flat/recommended 配置（Flat Config 格式）
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 6.2 编写插件入口的测试
    - **Property 12: All rules have complete metadata**
    - **Validates: Requirements 5.1, 5.2, 5.3**
    - 验证所有导出的规则都有 docs.description
    - 验证所有导出的规则都有 messages 对象
    - 验证所有导出的规则推荐级别为 error
    
    - **Property 13: Error messages use predefined message IDs**
    - **Validates: Requirements 5.4**
    - 触发各种规则违规，验证所有 message ID 都在 meta.messages 中定义
    
    - 测试 recommended 配置包含所有规则
    - 测试 flat/recommended 配置格式正确
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Checkpoint - 确保所有测试通过
  - 运行所有单元测试，确保通过
  - 运行所有属性测试，确保通过
  - 如有问题，询问用户

- [-] 8. 创建 Vite playground 进行真实项目测试
  - [x] 8.1 初始化 playground 项目
    - 创建 playground/package.json
    - 配置 Vite + React + TypeScript
    - 安装依赖（react, react-dom, vite, @vitejs/plugin-react）
    - 创建 playground/vite.config.js
    - _Requirements: 6.4_

  - [x] 8.2 配置 ESLint 使用插件
    - 创建 playground/.eslintrc.cjs
    - 配置使用本地插件（通过相对路径）
    - 配置 @typescript-eslint/parser
    - 启用所有三个规则
    - _Requirements: 4.2, 4.3_

  - [x] 8.3 创建测试用例文件
    - 创建 playground/src/components/ValidComponent.tsx（应该通过）
    - 创建 playground/src/components/InvalidComponent.tsx（应该报错）
    - 创建 playground/src/utils/helpers.pure.ts（pure module）
    - 创建 playground/src/utils/invalid.pure.ts（应该报错，导入 .tsx）
    - 创建 playground/src/config/constants.config.ts（pure module）
    - _Requirements: 6.4_

  - [x] 8.4 验证 playground 中的规则行为
    - 运行 ESLint 检查 playground 代码
    - 验证 ValidComponent.tsx 没有错误
    - 验证 InvalidComponent.tsx 有预期错误
    - 验证 invalid.pure.ts 有预期错误
    - _Requirements: 6.4_

- [x] 9. 创建文档
  - [x] 9.1 编写英文 README.md
    - 项目介绍和目标
    - 安装说明
    - 使用示例（Legacy Config 和 Flat Config）
    - 规则列表和简要说明
    - 链接到中文 README
    - 贡献指南链接
    - _Requirements: 7.1, 7.3, 7.8_

  - [x] 9.2 编写中文 README_CN.md
    - 项目介绍和目标（中文）
    - 安装说明（中文）
    - 使用示例（中文）
    - 规则列表和详细说明（中文）
    - 贡献指南链接
    - _Requirements: 7.2, 7.8_

  - [x] 9.3 编写规则文档
    - 创建 docs/rules/no-non-component-export-in-tsx.md
    - 创建 docs/rules/no-tsx-import-in-pure-module.md
    - 创建 docs/rules/no-heavy-deps-in-pure-module.md
    - 每个文档包含：规则说明、示例、配置选项
    - _Requirements: 5.5, 7.8_

  - [x] 9.4 编写贡献指南
    - 创建 CONTRIBUTING.md
    - 说明开发环境设置
    - 说明测试运行方式
    - 说明 PR 提交流程
    - _Requirements: 7.5_

- [x] 10. Final checkpoint - 最终验证
  - 运行所有测试，确保 100% 通过
  - 在 playground 中手动测试所有规则
  - 验证文档完整性和准确性
  - 验证 package.json 配置正确
  - 如有问题，询问用户

## Notes

- 所有任务都是必需的，确保从一开始就有全面的测试覆盖
- 每个任务都引用了具体的需求编号，便于追溯
- Checkpoint 任务确保增量验证
- 属性测试验证通用正确性属性
- 单元测试验证具体示例和边界情况
- 所有代码使用纯 JavaScript，无需构建步骤
- 测试使用 ESLint API 直接进行，参考 react-boundary 插件范式

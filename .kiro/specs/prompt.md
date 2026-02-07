你是一个资深前端基础设施工程师，请帮我实现一个 ESLint 插件，名字叫：

eslint-plugin-react-pure-export

插件目标是约束 React 项目中组件模块与纯逻辑模块的边界，以提升性能和 React Fast Refresh 稳定性。

需要实现以下规则：

规则一：no-non-component-export-in-tsx

规则说明：

- 针对所有 `.tsx` 文件
- 如果该文件 export 了运行时代码（const / function / let / var）
- 且该 export 不是 React 组件（React.FC、memo、forwardRef 返回值）
- 则报错

允许的 export：

- React 组件
- type / interface
- enum（仅 type-only enum，如果是运行时 enum 视为违规）

允许但不 export 的内容：

- 组件内部私有常量

不允许的示例：

```ts
export const PAGE_SIZE = 20;
export function calc() {}
export const config = {};
export const Home: React.FC = () => {};
```

允许的示例：

```
export const Home: React.FC = () => {};
export interface Props {}
export type Status = 'a' | 'b';
```

扩展实现：fixer，允许一键将选中的内容提取出单独的文件



规则二：no-tsx-import-in-pure-module

规则说明：

- 针对文件名匹配以下模式的模块：
  - *.pure.ts
  - *.utils.ts
  - *.config.ts
- 禁止 import 任何 `.tsx` 文件
- 报错信息需要明确指出这是 “pure module should not depend on tsx”

------

规则三（可选）：no-heavy-deps-in-pure-module

规则说明：

- 在 pure module 中禁止 import 以下依赖（通过配置项传入）：
  - react、react-dom等
  - 样式文件（.css/.less/.scss）



技术要求：

- 使用 ESLint Rule API（context, create, meta），支持ESLint 9+ (Flat Config)和ESLint 8 and below (Legacy Config)
- 使用 @typescript-eslint/parser 的 AST
- 给出完整的插件目录结构
- 每个 rule 提供：
  - meta.docs.description
  - meta.messages
  - 推荐级别为 "error"
- 给出 index.ts 导出 rules
- 给出简单的 usage 示例（.eslintrc.js）


注意：
0. 技术栈：pnpm+vitest单元测试 TDD 驱动开发+vite playground完成插件在真实项目中的测试
1. 中文输出spec，代码注释可以用英文
2. readme默认是英文的，单独拆一个中文的readme可以连接过去
3. 不要输出额外的总结，你只需要完成代码并且把项目做成符合开源规范的项目结构和架构
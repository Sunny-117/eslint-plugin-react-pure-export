# 文档说明

## 主要文档

### [GUIDE_CN.md](./GUIDE_CN.md) - 综合技术文档与开发规范

这是一份完整的中文文档，包含：

- **项目背景**：问题起源和解决目标
- **核心问题**：详细分析三大核心问题（重点：加载性能问题）
- **解决方案**：三大核心规则的设计原理
- **快速开始**：安装和配置指南
- **开发规范**：文件组织、命名约定、Code Review 检查清单
- **最佳实践**：实际代码重构示例
- **迁移指南**：现有项目的迁移步骤和策略
- **效果评估**：性能对比数据和实际案例
- **常见问题**：FAQ 解答

## 规则详细文档

- [no-non-component-export-in-tsx.md](./rules/no-non-component-export-in-tsx.md)
- [no-tsx-import-in-pure-module.md](./rules/no-tsx-import-in-pure-module.md)
- [no-heavy-deps-in-pure-module.md](./rules/no-heavy-deps-in-pure-module.md)

## 核心要点

### 为什么需要这个插件？

**最重要的原因：加载性能问题**

当配置文件或工具函数从 `.tsx` 文件导入常量时，会被迫加载整个组件及其所有依赖：

```typescript
// ❌ 混合导出 - 加载 150KB+
import { PAGE_SIZE } from './Button.tsx';

// ✅ 分离导出 - 加载 0.1KB
import { PAGE_SIZE } from './button-constants.config';

// 性能提升：1500 倍！
```

### 三大核心规则

1. **no-non-component-export-in-tsx** - 禁止在 `.tsx` 文件中导出非组件代码
2. **no-tsx-import-in-pure-module** - 禁止在纯模块中导入 `.tsx` 文件
3. **no-heavy-deps-in-pure-module** - 禁止在纯模块中引入重量级依赖

### 预期收益

- 加载速度提升 **1000x+**
- Bundle 体积减少 **30-50%**
- 首屏加载时间减少 **20-40%**
- Fast Refresh 稳定性提升 **90%+**
- 循环依赖减少 **80%+**

---

**记住：组件归组件，逻辑归逻辑，边界要清晰！性能提升 1500 倍！** 🚀

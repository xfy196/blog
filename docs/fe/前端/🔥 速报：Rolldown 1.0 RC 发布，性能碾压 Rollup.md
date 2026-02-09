---
isTimeLine: true
title: 🔥 尤雨溪官宣：Vite8来啦，Rolldown 1.0 RC 发布，性能碾压 Rollup
date: '2026-02-09'
tags:
  - 前端
  - 打包工具
  - rolldown
categories:
  - 打包工具
  - 前端
  - rolldown
---

# 🔥 尤雨溪官宣：Vite8来啦，Rolldown 1.0 RC 发布，性能碾压 Rollup
![](https://static.xxytime.top/2026/02/09/18-20-48-102612a469572250bbad706a1ad95231-20260209182047710-99bad3.png)


2026年1月21日，Rolldown 团队正式发布了 1.0 版本的候选版（RC）。这是一款用 Rust 编写的高性能 JavaScript/TypeScript 打包工具，号称比 Rollup 快 10-30 倍，同时保持了与 Rollup 插件生态的兼容性。


#### 🔥 一句话总结 Vite 8 的核心变革：

> **“不再用 esbuild 开发 + Rollup 构建的‘双系统切换’，而是启用统一引擎 Rolldown（Rust 编写）——一套内核，全链路提速。”**

这不仅是**性能跃升**，更是**架构范式升级**。

* * *

#### 🧠 为什么需要 Vite 8？——“过去的好设计，成了今天的包袱”

我们知道，Vite 1.x~7.x 的经典架构长这样：

```scss
开发阶段：  Vite + esbuild (⚡️ 快！)  
生产构建： Vite + Rollup (📦 稳！)
```

✅ 优点明显：

❌ 但隐患深埋：

> 就像一辆车：油门踩下去是电动车（安静迅猛），松开油门切回燃油机（轰鸣可靠）——可你总得在换挡时抖一下 🚗💨

* * *

#### 🛠️ Vite 8 的答案：**Rolldown —— 为 Vite 量身定制的 Rust 打包器**

| 维度 | Rollup（JS） | esbuild（Go） | **Rolldown（Rust）** |
| --- | --- | --- | --- |
| 语言 | JavaScript | Go | **Rust** ✅ |
| 性能 | 基准线 | ≈ 10x Rollup | **≈ esbuild，10–30x Rollup** ✅ |
| 插件兼容性 | Rollup 插件 | esbuild 插件 | **✅ 开箱兼容 Rollup/Vite 插件** |
| 生态集成 | — | — | **与 Oxc（编译器）深度协同** ✅ |
| 功能扩展 | 慢（JS 单线程） | 快但封闭 | **可扩展性强，支持模块联邦 / 完整打包模式** ✅ |

#### 🚀 什么是 Rolldown？

Rolldown 是为 Vite 打造的下一代打包工具，它融合了 esbuild 的速度优势和 Rollup 的生态兼容性，甚至提供了类似 webpack 的精细代码分割控制。

#### ✨ 核心特性

1. **极致性能**：基于 Rust 实现，通过并行处理实现 10-30 倍于 Rollup 的速度，同时提供 WASM 版本保证跨平台兼容性。
2. **无缝迁移**：完全兼容 Rollup 插件 API，现有 Rollup 插件可以直接使用。
3. **内置转换**：通过 Oxc 引擎支持 TypeScript、JSX 和语法降级。
4. **原生模块支持**：内置 CJS/ESM 互操作性和 Node.js 模块解析，无需额外插件。
5. **精细代码分割**：通过 `output.codeSplitting` 提供类似 webpack 的 chunk 控制能力。

#### 🛠️ 快速上手

```bash
# 安装
npm install -D rolldown

# 创建配置文件
// rolldown.config.js
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js'
  }
})

# 运行构建
npx rolldown -c
```

#### 📌 RC 版本意味着什么？

RC 版本标志着 API 稳定性，官方承诺在 1.0 正式版发布前不会有破坏性变更。不过部分实验性功能（如模块类型和监听模式）可能仍会调整，建议在生产环境中谨慎使用。

#### 📈 主要改进

自 beta.1 以来，团队已提交超过 3400 次代码变更，包括：
- **Vite 集成**：将多个 Vite 内部插件移植到 Rust，提升性能
- **性能优化**：109 项性能改进，包括 SIMD JSON 转义、并行 chunk 生成等
- **代码分割优化**：减少 chunk 数量，合并小型包装 chunk
- **兼容性提升**：通过 900+ Rollup 测试和 670+ esbuild 测试
- **API 稳定**：多个实验性 API 转正，默认配置优化

#### 🗺️ 未来路线

1. **RC 阶段**：收集社区反馈，修复关键 bug，确保 API 稳定
2. **Vite 8**：将 Rolldown 作为默认打包工具，统一开发和生产构建流程
3. **Rolldown 1.0**：经过生产环境验证后发布稳定版
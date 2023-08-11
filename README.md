<h1 align="center"> 小小荧 </h1>
<p align="center">你的指尖,拥有改变世界的力量</p>
<p align="center">博客主题：<a href="https://www.xxytime.top/" target="_blank">小小荧</a></p>

## 仓库介绍

这是一个 monorepo 仓库，目前有如下四个部分

- [blogpress](./packages/blogpress/)：博客内容本身
- [小小荧](./packages/theme/)：博客分离出的通用 VitePress 主题
- [创建主题模板项目 CLI](./packages/create-theme/)：用于快速创建和作者一样风格的博客
- [vitepress-plugin-pagefind](./packages/vitepress-plugin-pagefind/)：基于 pagefind 实现的 VitePress 离线全文搜索支持插件

## 运行本项目

博客基于[vitepress](https://vitepress.vuejs.org/)构建

① 先安装 `pnpm`

```sh
npm i -g pnpm
# 安装依赖
pnpm install
```

② 构建主题包

```sh
pnpm build:theme-only
```

③ 运行

```sh
# 运行博客
pnpm dev

# 运行主题包文档
pnpm dev:theme
```

## :pencil:关于内容

大前端开发相关知识，包含但不限于前端

记录面试中所遇的问题，并整理相关知识点，分模块进行了梳理

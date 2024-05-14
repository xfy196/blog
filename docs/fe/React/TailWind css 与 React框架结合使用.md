---
isTimeLine: true
title: TailWind css 与 React框架结合使用
date: 2021-03-13
sticky: 999
tags:
  - React
categories:
  - 前端
---

### 简介

TailWind.css 是什么？(顺风)？他是一个 CSS 的工具集。

Tailwind CSS 是一个高度可定制的基础层 CSS 框架，它为您提供了构建定制化设计所需的所有构建块，而无需重新覆盖任何内建于框架中的设计风格。

### 繁杂

在日常的项目开发阶段，我们最头疼的就是各种情况的兼容和布局自适应问题，每当不同的业务场景和数据场景都会出现不同的布局适应问题，这个时候开发人员大量时间都会忙于调试布局问题，兼容问题，包括每一个页面基础架子的搭建，都会需要重新设计，除非你自己设计一套可以兼容该项目的 CSS 框架，这个时候 TailWind.css 就帮助我们高效的完成了页面布局，特效编写，自适应兼容等问题了。

> 那我们就开始吧，看看如何在 React 项目中使用这个框架吧

### 创建一个 React 项目

通过使用`create-react-app`命令创建一个新的 React 项目

```
npx create-react-app cra-tailwind-template
cd cra-tailwind-template
```

如果没有安装过`create-react-app`包,会先安装包， 输入`yes`直接安装

这样成功创建一个 React 的项目模板，并进入到项目的根目录

### 安装 Tailwind CSS

通过一下命令执行安装

```shell
npm install tailwindcss@npm:@tailwindcss/postcss7-compat @tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

### 配置 Craco

Craco 是一个为通过在应用程序的根目录中添加 craco.config.js 文件，即可给 eslint，babel，postcss 等添加自定义配置，这样可以统一集中化管理所有的配置。你创建项目的 REact 项目而使用的简易的配置层。

```shell
npm install @craco/craco
```

安装好之后，编辑项目中 package.json 文件`scripts`部分

```bash
"scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "craco test",
    "eject": "react-scripts eject"
},
```

接下来，我们需要在项目根目录手动创建一个 craco.config.js 文件，并且添加 tailwind 和 autoprefix 作为 PostCSS 插件

```jsx
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')]
    }
  }
}
```

接着正式在项目中引入 tailwind CSS 框架，通过以下命令创建 tailwind.config.js 文件

```kotlin
npx tailwind init
```

创建好的文件位于项目的根目录下

### 编辑 tailwind.config.js 文件

下面，我们需要对 tailwind.config.js 文件进行编辑，将配置里`purge`项根据模板的路径，这样避免没有使用到的样式编译进生产环境的代码中

```java
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
```

### 将 Tailwind 引入到 CSS 中

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

最后将`index.css`引入到你的`src/index.js`文件中

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css' // include index.css
import App from './App'
import reportWebVitals from './reportWebVitals'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
```

到此，所有的配置就结束了，我们可以在模板或者页面文件中使用 Tailwind CSS 了

> 这里注意使用 TailWind CSS 我们需要注意你下载不同版本的 TailWind CSS 和自己电脑 node 的版本

https://tailwindcss.com/

### 小试牛刀

![Peek 2021-03-13 18-27.gif](https://cdn.jsdelivr.net/gh/xfy196/images@main/202308141514744.png)

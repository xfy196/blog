---
isTimeLine: true
title: Hono与Honox一次尝试
date: 2025-12-28
tags:
  - Node
  - Hono
  - Honox
categories:
  - 后端
  - 前端
  - Node
---
# Hono与Honox一次尝试
最近心血来潮，尝试着用Hono和Honox写了一个简单的Web应用。但是我被折磨了一顿😣。最近看到了hono+cloudflare搭建一个接口服务还是很有趣的，本想着用来搭建一个图床的服务，突然看到官网hono中可以编写jsx组件，于是来的兴趣准备尝试尝试。
![](https://static.xxytime.top/2025/12/28/17-32-34-17181f9131880e71a5f53dcf7600d75f-20251228173233695-bce866.png)

**Hono是一个用于Node.js的Web框架，而Honox是Hono的实验性版本，旨在提供更好的性能和更现代的API。我尝试着用Hono和Honox写了一个简单的Web应用，结果出乎意料的好。Honox的性能比Hono更好，API也更现代，推荐给大家。**
## 环境准备
1. 安装Node.js和npm
2. 创建一个新项目
3. 安装Hono和Honox
4. 配置D1数据库本地用SqlLite代替
5. 部署cloudflare workers先把项目跑起来😊
> 以上的操作都没有问题，一切看起来如此的顺利😊。

### 槽点一
honox的文档写得不够详细，很多地方都看不太懂。
```tsx
// app/routes/index.tsx
// `createRoute()` helps you create handlers
import { createRoute } from 'honox/factory'

export default createRoute((c) => {
  return c.render(
    <div>
      <h1>Hello!</h1>
    </div>
  )
})
```
以上代码`createRoute`内不支持`react`运行时语法，比如:`useEffect`语法无法使用,只能使用`honox`的`jsx`语法。在请求数据的时候的时候我还傻傻的在`useEffect`中写`fetch`请求数据，结果可想而知， honox中没有`useEffect`，也没有`useState`，有的只是`c.request`和`c.render`。而正确的做法是直接调用DB的服务查询数据，直接在服务端渲染。其实这也是陷入了`ssr`的陷阱。但这种模式更像是传统的后端开发中前后端不分离的一种架构方式
### 槽点二
`jwt`中间件失效，按照官方文件所言在hono的是可以直接拦截鉴权逻辑的，但是在honox中却是失效的需要honox还在beta版本中的原有一些hono的配套的中间件还没有完全支持，所有我有自己写了一个鉴权的中间件逻辑
### 槽点三
没有配套的`ui`组件库，比如`antd`、`element`等，所有需要自己写样式或者使用`honox`的`jsx`语法自己写组件
不过还好他支持`tailwindcss`
### 总结
`Honox`都还处于beta版本，还有很多功能没有完善，但是总体来说，`Honox`确实为hono提供了更优雅的ui组件编写方式，结合了`jsx`，融入了`react`的语法，让后端模板语法写起来更加优雅。但是尝鲜毕竟只是尝鲜，实际生产中需要使用ssr还是推荐使用`nuxt.js`或者`next.js`。`hono`我也推荐只是用在一些小项目或者实验性项目中。尝鲜网址 [图床](https://imgbed.xxytime.top/)

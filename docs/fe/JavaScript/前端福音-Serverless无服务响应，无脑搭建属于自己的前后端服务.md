---
isTimeLine: true
title: 前端福音-Serverless无服务响应，无脑搭建属于自己的前后端服务
date: 2021-04-19
tags:
  - JavaScript
categories:
  - 前端
  - 部署服务
---

# 前端福音-Serverless 无服务响应，无脑搭建属于自己的前后端服务

还在为前端不是代码发愁么，还在为前端没有后端发愁么？有了它(Serverless)， 我觉得你从此走向人生巅峰。经常有同学问我，自己写了个项目，怎么部署啊，linux 不太熟，而且还需要花钱买服务器，这怎么办了。他来了!他来了！他来了！[ vercel](https://vercel.com/) 一个由 next.js 团队打造的 Serverless 平台。

### Vercel 是什么？

简单来说他和 gitpage 很像，你可以通过类似 hexo 这样静态模板技术来部署一套属于自己的个人博客， 这个实际上 github 已经自带了，可以参考作者的 github 博客 [个人博客 ](https://xfy196.github.io/)，但是 vercel 可没那么简单，他可能是个爸爸。那么 vercel 到底可以干什么？除了类似于 gitpage 部署一套静态模板，还支持的可比 gitpage 多多了，我们瞅瞅：

![FireShot Capture 003 - New Project – Vercel - vercel.com.png](https://static2.xxytime.top/2026/11/03/3049b3ee-9d1e-408b-914a-e4601087e68c.png)

上面就是 vercel 所支持的，而 gitpage 所提供的服务，仅仅是编写静态页面，然后按照一定的规则进行归类，虽然市面上有比较好用的工具可以生成这些静态页面,例如(hexo, gitbook)但是能功能依旧没有没有 vercel 强大，灵活度也不够。vercel 不仅解析 hexo，gitbook 的功能同时还支持 pc 端移动端，并且基于前端主流框架作为模板，例如：Vue.js, React.js, Svelte.js, Angular, Nuxt.js, Next.js 都支持，也就是说基本包含了所有市面主流的框架技术，尽管我们不依赖 Vue，React 这样的框架开发，与我无关紧要，你可以自己边写，部署脚本，基于自己的规则，让 nodejs 帮你处理和打包，而且它还具备与 github 或者 Gitlab 实时响应的功能，只要映射过仓库地址，那么仓库的数据发生变化，vercel 就会重新更新部署，无需手动部署，这也就是 CI 部署。那么问题来了，前端页面 vercel 帮我们处理好了，后端数据怎么办呢。🐂 就 🐂 在这里了，vercel 是 Serverless 架构的，可以帮我们完成 Fass 应用的部署，现已支持 Node.js, Go, Python, Ruby 语言了，那么对我们前端的小伙伴太友好了，看到 Node.js，很多前端同学是不是很激动，反正我是很激动,😜，他可以让 nodejs 服务部署在上面，来为各个服务提供支持，例如:egg.js, express, koa 等这些 web 服务框架，否可以部署在上面。

> 说了这个多我们还是来试试吧

### 玩一玩 vercel

首先我们进入网站[ ](https://vercel.com/)

![image.png](https://static2.xxytime.top/2026/11/03/961da85d-3db0-46c7-b307-0d75fc3e5ea8.png)

这里我们先部署 express 的项目
![image.png](https://static2.xxytime.top/2026/11/03/a114a9d4-0124-4e0d-a879-9b51c470a952.png)
点击 import 导入项目

![image.png](https://static2.xxytime.top/2026/11/03/0083efb9-04d5-485d-9c69-8fce5f82998a.png)

![image.png](https://static2.xxytime.top/2026/11/03/766566c1-13c0-4870-929f-28eb1d223244.png)

![image.png](https://static2.xxytime.top/2026/11/03/838b31a4-68ff-4d36-986e-8f51d5b1601c.png)

![image.png](https://static2.xxytime.top/2026/11/03/c12788ea-7d3c-446f-b46a-330bc4b39058.png)

![image.png](https://static2.xxytime.top/2026/11/03/df37700a-4693-4144-a835-5fa20f4969b0.png)
我们浏览一下，点击 visit

![image.png](https://static2.xxytime.top/2026/11/03/b0b45f7c-3e30-476d-8ec7-810616e63358.png)
成功进入 express 默认的页面
这样一来 nodejs 的接口服务也部署好了，但是想要成功部署 nodejs 的项目我们还需要在我们的项目配置一些东西,或者自己重新设置一下启动脚本

- 第一步
  在我们的项目根目录创建 vercel.json
  ![image.png](https://static2.xxytime.top/2026/11/03/ca4172b3-6fcb-4b24-8381-7d3b0628c497.png)

```json
{
  "version": 2,
  "builds": [
    {
      "src": "./index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

看起来的意思是说 src 的根文件是 index.js 使用 vercel 的 node 运行这个文件，那我们再看看 index.js 下面有什么吧

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c56c9028182846aca4d59d28c42efed4~tplv-k3u1fbpfcp-watermark.image)
看起来没啥，直接一行代码 🙃，但是如果你是一个熟悉 express 开发和 common.js 规范的人你就明白这句话是什么意思了。意思就是: 调用 index.js，就会执行 require() ，而 require 底层实际上是一个自执行函数，那么间接的调用了./bin/www 文件，而且 express-generator 中启动文件就是 bin/www 文件,这样一来 express 的服务就启动了，那么 vercel 那个文件配置的目的，就是告诉默认的 vercel 不要去 build 了直接按照我告诉你的执行区执行脚本吧。ok 到此实际上 node 的服务已经搭建成功了。

**到这来说 Serverless 并没有完全体现，Fass 也没有完全体现，再看接下来的案例，你也许就会明白了**
我们按照刚才的部署重新导入一个新的项目，这个新的项目呢我们不使用任何的脚手架或者框架，起名 api-proxy
大致的目录是这样的

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/48fea51aaefe426685be63bf58c71de4~tplv-k3u1fbpfcp-watermark.image)
就是一个 npm init 创建的项目，不过有一点不一样的就是我创建了一个 api 文件夹，这里面要写的 js 就是一个个的 Function，每一个 Function 就是提供这一类服务，这里我们编写一个比较简单的代理服务的 Function，来演示 Fass 的应用。

```js
const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = (req, res) => {
  let target = ''

  // 代理目标地址
  // 这里使用 backend 主要用于区分 vercel serverless 的 api 路径
  if (req.url.startsWith('/api')) {
    target = 'https://api.music.xxytime.top'
  }

  // 创建代理对象并转发请求
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      '^/api/': '/'
    }
  })(req, res)
}
```

如果你熟悉 nodejs，应该能明白这里借助了`http-proxy-middleware`完成了一个接口代理服务。
接下来还是老样子，回到 vercel 官网，把之前项目从 git 中来去进来部署，部署成功之后呢，你在浏览器中输入当前代理的接口，你会发现接口代理成功了。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9924cfb8d4a24e68a8ac0853fb43fe9b~tplv-k3u1fbpfcp-watermark.image)
如果还不相信的话，你可以返回这个项目的 dashborad 中查看一个叫 Functions 的面板

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b46aee497f35446385a826a2f53e88c8~tplv-k3u1fbpfcp-watermark.image)
你所有的请求响应状态都会在里显示。

**部署前端的代码那就比较容易了**
我们只需要选择好编写前端代码的模板或者自定义脚本，然后执行与上一样的操作即可，最后部署出来的效果就是：拿着作者部署的前后端项目演示

[react 版本网易云音乐](https://music.xxytime.top/)

[Vue3.0 版本网易云](https://mp.v3music.xxytime.top/)

[网易云接口服务](https://musicapi.xxytime.top/api/banner)

同时欢迎各位同学来我的 github 中点赞，学习，交流

[react 版本网易云](https://github.com/xfy196/cloud-music-react)

[Vue3.0 版本网易云](https://github.com/xfy196/vue3.0-cloud-music)

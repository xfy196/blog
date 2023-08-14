---
isTimeLine: true
title: react项目中使用装饰器
date: 2021-03-29
tags:
  - React
categories:
  - 前端
---

首先安装 babel 转换器

```sh
yarn add  @babel/core @babel/preset-env @babel/plugin-proposal-decorators -D
npm i @babel/core @babel/preset-env @babel/plugin-proposal-decorators -D
```

在你的 react 根目录下创建.babelrc 文件写入

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ]
}
```

安装`react-app-rewired`react 项目服务启动脚本

```sh
yarn add react-app-rewired -D
```

修改 packjson.json 的脚本配置
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/36b7e1045cf344bdb3e22d9837cf7301~tplv-k3u1fbpfcp-zoom-1.image)
安装 react--app-rewired 支持的一个插件

```sh
yarn add customize-cra -D
```

写入装饰器装换的配置文件， 文件名固定不能改变`config-overrides.js`

```js
const path = require('path')
const { override, addDecoratorsLegacy } = require('customize-cra')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const customize = () => (config, env) => {
  config.resolve.alias['@'] = resolve('src')
  if (env === 'production') {
    config.externals = {
      react: 'React',
      'react-dom': 'ReactDOM'
    }
  }

  return config
}

module.exports = override(addDecoratorsLegacy(), customize())
```

然后正常启动服务就行

```sh
yarn start
```

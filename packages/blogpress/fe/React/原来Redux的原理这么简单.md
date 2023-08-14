---
isTimeLine: true
title: 原来Redux的原理这么简单
date: 2021-05-09
tags:
  - React
categories:
  - 前端
---

熟悉`React`的开发者并不陌生`Redux`是什么,一个状态管理容器，简单来说就是帮助前端存储交互的数据的容器。
笔者今天聊的就是如何手写一个`Redux`，破除那些把`Redux`神话的同学么。

> Tip: 一定要熟悉 JavaScript 的原理哦

### 了解 Redux 的运行原理

**三大原则**

- 单一数据流
- State 只读
- 只能使用纯函数来执行修改
  **工作原理**
  ![](https://cdn.jsdelivr.net/gh/xfy196/images@main/202308141354684.png)
  从图片中我们可以看到，Redux 的工作原理`Action Creators`通过派发方法`dispatch` ,然后派发的`action`会被`Reducer`层拿到进行处理，最后行成新的`Store`数据，最后被`React Component绑定`， 页面发生改变

### 声明 Store

我们需要创建一个 Store 的函数

```js
function createStore(reducer) {
  let state
  let getState = () => JSON.parse(JSON.stringify(state))
  return {
    getState
  }
}
```

这里的`reducer`是一个回调函数

```js
const CHANGE_TITLE = 'change_title'
function reducer(state = { title: '标题' }, action) {
  switch (action.type) {
    // 一下的reducer就是我们具体实现存储值的逻辑
    case CHANGE_TITLE:
      return { ...state, title: action.data }
    default:
      break
  }
  return state
}
```

看到这里是不是有那味了，我想对于 React+Redux 的使用者来说这个 reducer 是不是非常熟悉了，那么每一次的派发我们只需要重新 reducer 一次，就可以把派发的值给重新修改了
**diapatch 方法**

```js
function dispatch(action) {
  state = reducer(state, action)
}
```

`ok`派发方法有了，创建 Store 函数有了，我们还差 render 方法，来让页面同步更新

> 创建 render 方法我们必须明白，当 state 发生改变的时候，页面就应该响应了，那么这里不得不使用一个订阅发布者模式来完成

### 创建 render 方法并优化 dispatch 方法

```js
function createStore(reducer) {
  let state
  function dispatch(action) {
    state = reducer(state, action)
    // 每一个改变值之后去重新渲染监听器中的函数
    listeners.forEach((item) => item())
  }
  // 优化思路 加入发布订阅模 式
  let listeners = []
  let subscribe = (fn) => {
    listeners.push(fn)
    // 加入取消绑定的函数
    return () => {
      ;(listeners) => listeners.filter((item) => item != fn)
    }
  }

  // 第一次创建需要覆盖自身的对象
  dispatch({})
  let getState = () => JSON.parse(JSON.stringify(state))
  return {
    getState,
    dispatch,
    subscribe
  }
}
let CHANGE_TITLE = 'change_title'
let store = createStore(reducer)
function reducer(state = { title: '标题' }, action) {
  switch (action.type) {
    // 一下的reducer就是我们具体实现存储值的逻辑
    case CHANGE_TITLE:
      return { ...state, title: action.data }
    default:
      break
  }
  return state
}
// 定义一个渲染页面节点的函数
function render() {
  document.querySelector('.title').innerHTML = store.getState().title
}
```

这里我们可以看到，render 方法看似比较简单的，但是如果让 render 方法可以比较聪明的渲染呢？

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/015a3909ef064ba69fec736feccf852f~tplv-k3u1fbpfcp-watermark.image)
他们就是关键。首先`subscribe`是一个订阅函数，用来传入每一个`render`，然后将每一个`render`函数放入监听数组中，等待下一次`dispatch`改变值的时候来循环调用数组中的`render`函数,这样就形成了，数据已发生改变就可以立即响应页面的功能了，我们来看看完整的代码是什么样子的

```js
/**
 * 核心概念store state reducer dispatch action
 */
function createStore(reducer) {
  let state
  function dispatch(action) {
    state = reducer(state, action)
    // 每一个改变值之后去重新渲染监听器中的函数
    listeners.forEach((item) => item())
  }
  // 优化思路 加入发布订阅模 式
  let listeners = []
  let subscribe = (fn) => {
    listeners.push(fn)
    // 加入取消绑定的函数
    return () => {
      ;(listeners) => listeners.filter(item >= item != fn)
    }
  }

  // 第一次创建需要覆盖自身的对象
  dispatch({})
  let getState = () => JSON.parse(JSON.stringify(state))
  return {
    getState,
    dispatch,
    subscribe
  }
}
let CHANGE_TITLE = 'change_title'
let store = createStore(reducer)
function reducer(state = { title: '标题' }, action) {
  switch (action.type) {
    // 一下的reducer就是我们具体实现存储值的逻辑
    case CHANGE_TITLE:
      return { ...state, title: action.data }
    default:
      break
  }
  return state
}
// 定义一个渲染页面节点的函数
function render() {
  document.querySelector('.title').innerHTML = store.getState().title
}
// 第一次页面加载的render方法
render()
// 拥有监听器之后我们只需要
let unsubscribe = store.subscribe(render)
// 每次更新值的render方法
setInterval(() => {
  store.dispatch({
    type: CHANGE_TITLE,
    data: '我是重新改变之后的title' + Math.random() * 100
  })
  // 上面渲染完成之后直接将没有用的监听函数取消
  unsubscribe()
}, 2000)
// 大致上面实现思路就是一个最简单的redux的实现过程
```

大家可以把它放在一个页面之中运行就可以看到效果了，本文的环境基于`node v14`，就不做效果演示了.😜😜😜

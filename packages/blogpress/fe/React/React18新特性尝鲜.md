---
isTimeLine: true
title: React18新特性尝鲜
date: 2022-08-14
tags:
  - React
categories:
  - 前端
---

# React18 新增的特性

### 1. Automatic batching

在 React 中多次的`setState`合并到一次进行渲染。

也就是说，setState 并不是实时修改 State 的, 而是将多次的 setState 调用合并起来仅出发一次渲染，即可以减少数据状态存在中间值导致的不稳定性，也可以提升渲染性能，可以理解为如下代码：

```
  const handleClick = () => {
    setName("小帅")
    setAge(22)
    // 仅触发一次渲染
  }
```

但是，在 React18 以前，异步函数中的 setState 并不会执行合并，由于丢失上下文，无法做到合并处理，所以每次的 setState 调用都会立即出发一次重新渲染，除了重复 setState，React18 带来的优化就是可以再任何情况下进行渲染优化了(异步回调函数,promise, 定时器)的回调函数中调用多次的 setState 也进行了合并渲染。

当然如果你非要 setState 调用后立即重新渲染也行，只需要用`flushSync`包裹:

```
  import {flushSync} from "react-dom"

  const handleClick = () => {
    flushSync(() => {
      setName("小帅") // 立即渲染
    })
    setAge(22)
  }
```

> 开启这个特性的前提是，将 ReactDom.render 替换成 ReactDom。createRoot 调用方式

## 2.新的 ReactDom Render API

升级的方式很简单

```
import ReactDOM from 'react-dom/client';
const container = document.getElementById("app");

// 旧 render API
ReactDOM.render(<App tab="home" />, container);

// 新 createRoot API
const root = ReactDOM.createRoot(container);
root.render(<App tab="home" />);
```

#### Concurrent APIS

Concurrent Mode 就是一种可中断渲染的设计架构，什么时候中断渲染呢？当一个更高优先级渲染到来时，通过放弃当前的渲染，立即执行更高优先级的渲染，换来视觉上更快的响应速度。

有人会说，不对呀，中断渲染后，之前的渲染 CPU 执行不就浪费了吗？换句话说，整体执行时长增加了。这句话是对的，但实际上用户对页面的交互及时性的感知是分为两种的，第一种是即时输入反馈。第二种是这个输入带来的副作用反馈，比如更新列表。其中，即使输入反馈只要能优先满足，即时副作用反馈慢一些，也会带来更好的体验，更不用说副作用反馈大部分情况会因为输入反馈的变化而作废。

由于 React 将渲染 DOM 树机制改为了两个双向链表，并且渲染树指针只有一个，指向其中一个链表，因此可以在更新完全发生后在切换指针指向，而在指针切换之前，随时可以放弃对另一棵树的修改。

#### startTransition

首先看一下他的基本用法

```
 import { startTransition } from "react";
   const handleClick = () => {
    // 标识为非紧急更新
    startTransition(() => {
      setName("小帅")
    })
    setAge(22)
  }
```

简单来说， 就是被 startTransition 回调包裹的 setState 触发的渲染被标记为不紧急的渲染，这些渲染可能被其他的紧急渲染抢占。

举个例子，当 setName 更新的列表内容很多，导致渲染是 CPU 占用 100%时，此时用户进行一个输入，即触发了由 setAge 引起的渲染，辞职 seName 引起的渲染会立即停止，转而对 setAge 进行渲染支持，这样用户的输入就能快速的反映在 UI 上，代价是设置 name 的 UI 响应会慢一点。而一个 transition 被打断状态可以听过 isPending 访问到：

```
import { useTransition } from "react";
const [isPending, startTransition] = useTransition();
```

#### SSR for Suspense

完整名称是: Streaming SSR with selective hydration

其实就是像流水一样，打造一个从服务端到客户端持续不断的渲染管线，而不是 renderToString 那样一次性渲染机制，selective hydration 标识选择性水合，水合指的是后端内容打到前端后，js 需要将事件绑定，才能够响应用户的交互或者 DOM 的更新行为，而在 React18 之前，这个操作必须是整体性的，而水合的过程可能比较慢，会引起局部卡顿，所以选择性水合可以按序优先进行水合

所以这个特性其实是转为 SSR 做准备的，而功能启用的载体就是 Supense(所以以后不要再认为 Suspense 只是一个 loading 的作用)。其实在 Suspense 设计之初，就是为了解决服务端渲染问题，只是一开始装载了客户端的按需加载的功能，后面你会逐渐发现 React 赋予了 Suspense 根多强大的功能。

SSR for Suspense 解决了三个主要问题：

- SSR 模式下，如果不同的模块取数效率不同，会因为最慢的一个模块拖慢整体的 HTML 的吞吐时间，这可能导致体验还不如非 SSR 来的好，举一个极端情况，假设报表中一个组件依赖了慢查询，需要五分钟数据才能出来，那么 SR 的后果就是白屏时间拉长到 5 分钟。
- 即使 SSR 内容打到了页面上，由于 js 没有执行完毕，所以根本无法进行 hydration，整个页面处于无法交互状态。
- 即使 js 加载完了，由于 React18 之前只能进行整体的 hydration，可能还是会导致卡顿，导致首次交互响应不及时

最大的区别在于，服务端渲染有简单的 res.send 改为 res.socket。这样的渲染就从单次行为转变为持续性行为。

那么总结一下，新版的 SSR 性能提高的秘诀：按需

### 总结

结合起来看，React18 关注点在于更快的性能以及用户交互响应效率，其实设计理念处处包含了中断和抢占的概念

以后提到前端性能优化，我们其实也可能从中断和抢占这个视角去考虑问题

- 随时中断框架的设计，第一优先级渲染策略，用户最关注的 UI 交互模块
- 从后端到前端"顺滑"的管道式 SSR，并将 hydration 过程按需化，且支持被更高优先级用户交互打断，第一优先水合用户正在交互的部分

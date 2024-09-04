---
isTimeLine: true
title: vue3.5最新发布，这几个新用法还不快来学习一下！
date: 2024-09-04
tags:
  - Vue
  - Vue3
categories:
  - 前端
---

# 📢vue3.5最新发布，这几个新用法还不快来学习一下！

## 前言

就在昨天（`2024-09-03`），`vue`官方发布了`vue.js3.5`的稳定版本，在`vue`的官方英文文档上也已经能看到`3.5`版本更新的内容，该版本不包含重大更改，包括内部改进和实用的新功能。下文来了解几个比较有意思的改动。

## 响应式 Props 解构

`vue3.5`**前响应式解构props用法**

使用`toRef()`这个`api`对`props`的参数进行响应式解构，如下所示：

```js
<script setup lang="ts">
import { toRef } from 'vue'

const props = defineProps<{
  count: number
}>()

// 响应式解构count属性
const count = toRef(props, 'count')

// 测试count响应式，子组件按钮点击输出解构的count值
const log = () => {
  console.log(count.value)
}
</script>
```

`vue3.5`**响应式解构props方法**

```js
<script setup lang="ts">

// vue3.5可以直接响应式解构
const { count } = defineProps<{
  count: number
}>()

// 测试count响应式，子组件按钮点击输出解构的count值
const log = () => {
  console.log(count)
}
</script>
```

`vue3.5`对解构变量（例如`count`）的访问会被编译器自动编译成`props.count`，因此访问时会对其进行跟踪。

## props默认值写法

`vue3.5`**前props默认值写法**

```js
// 使用ts泛型时默认值写法(编译时)
const props = withDefaults(
  defineProps<{
    count: number
  }>(),
  {
    count: 0
  }
)

// 使用js时默认值写法(运行时)
const props = defineProps({
  count: {
    type: Number,
    default: 2
  }
})
```

`vue3.5`**props默认值写法**

```js
// ts写法
const { count = 1 } = defineProps<{
  count: number
}>()

// js写法
const { count = 2 } = defineProps({
  count: String
})
```

可以直接像在`JavaScript`语言中对象解构的语法一样赋予默认值，有效降低了用户的心智负担！**这点看起来挺不错的！**

## useTemplateRef()获取模板引用实例

`useTemplateRef()`

```js
<template>
  <div class="list" ref="listEl">
    <div ref="itemEl" class="item" v-for="item in list" :key="item">
      {{ item }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTemplateRef, onMounted } from 'vue'

const list = [1,2,3]

const listRef = useTemplateRef('listEl')
const itemRef = useTemplateRef('itemEl')

onMounted(() => {
  console.log(listRef.value)  // div.list
  console.log(itemRef.value)  // Proxy(Array) {0: div.item, 1: div.item, 2: div.item}
})
</script>
```

当在模板做绑定的`ref`具有多个同名的元素时，`useTemplateRef()`返回的是一个数组，如上通过`v-for`渲染的`div`绑定`ref="itemEl"`的列表。

## `<Teleport>`组件优化

内置`<Teleport>`组件的一个已知限制是，其目标元素必须在`<Teleport>`组件挂载时已存在。 在`vue3.5`中，`<Teleport>`组件引入了一个在当前渲染周期之后挂载它的`defer` prop， 如下用法：

```js
  <Teleport defer to="#cont">
    <div v-if="open">
      <span>挂载到id为cont的div上</span>
      <button @click="open = false">关闭</button>
    </div>
  </Teleport>
  <!-- Teleport组件传送内容的容器 -->
  <div id="cont"></div>
  <button @click="open = true">打开</button>
```

由于`<div id="cont"></div>`在`Teleport`后面渲染，需要加`defer`延迟挂载`Teleport`组件。如果把`<div id="cont"></div>`放到`Teleport`前面渲染，则不需要加`defer`。

## `useId()`生成应用唯一标识

`useId()`可用于生成每个应用程序唯一的 ID，这些 ID 可确保在服务器和客户端渲染过程中保持稳定。可用于生成表单元素和可访问性属性的 ID，并可在 SSR 应用程序中使用，而不会导致ID冲突：

```js
<script setup>
import { useId } from 'vue'

const id = useId()
</script>

<template>
  <form>
    <label :for="id">Name:</label>
    <input :id="id" type="text" />
  </form>
</template>
```

这个貌似可以单纯的当成一个生成唯一`id`的`api`来使用。

## 结语

除了以上提到的外，`vue3.5`还重构了响应式系统，性能方面得到了提升，据说在处理某些情况下可使性能提高到`10`倍。

## 参考引用

想了解更多`vue3.5`的更新内容，可点击访问该链接 [Announcing Vue 3.5](https://blog.vuejs.org/posts/vue-3-5 "https://blog.vuejs.org/posts/vue-3-5")，获取更多资讯。

有关更改和新功能的完整列表，请参阅[GitHub 上的完整更新日志](https://github.com/vuejs/core/blob/main/CHANGELOG.md "https://github.com/vuejs/core/blob/main/CHANGELOG.md")。
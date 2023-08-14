---
isTimeLine: true
title: 你还记得这些DOM操作么？
date: 2023-08-14
recommend: -999
tags:
  - JavaScript
categories:
  - 前端
  - js
---

由于 Vue 和 React 这些技术栈的崛起和完善，很多时候前端已经不在编写纯原生 js 和大量的 DOM 操作，那些原滋原味的 DOM 操作也淡入我们的视野之中。

## 初步回忆

许多 web 开发者认为 DOM 真的很难（或者很慢），你需要很多框架来驯服它。然后他们花了很多时间来学习框架，一两年过去之后，另一个框架变得流行，你需要从头开始学习一切。这样重复几次，JavaScript 疲劳就出现了。更不用说一大堆依赖。
如果我告诉你 DOM 没有那么难，你会相信吗？如果不需要依赖第三方的库来掌握 DOM 是不是很酷，你会再给 DOM 一次机会吗？我们一起来看看：

> DOM is not that hard and especially not slow.

## 创建元素

让我们开始创建 DOM 元素吧，为了创建 DOM 元素我们需要使用到 document.createElement(tagName)方法

```js
let h1Ele = document.createElement('h1')
```

## 修改文本内容

```js
h1Ele.textContent = 'hello dom'
```

## Attributes

```js
h1Ele.setAttribute('class', 'hello')
```

为了管理类，用 element.className 属性

```js
h1Ele.className = 'hello'
```

然后还有更加简单的方法就是 classList 方法

```js
h1Ele.classList.add('hello')
h1Ele.classList.remove('hello')
```

> 如果你不确定使用 attributes 还是 properties，那就使用 attributes，除了一些表单元素的状态，像是 value 或 checked 需要使用
> 除了下面这些，你不能用 element.setAttribute(someBoolean, false)来设置 bool 值：

```js
input.value = 'ture'
input.setAttribute('value', 'ture')
input.checked = false
```

## 添加元素

```js
document.body.append(input)
```

## 删除元素

```js
document.body.remove(input)
```

## 查找时间

```js
document.getElementById(id)
document.getElementsByClassName(className)
document.getElementsByName(name)
document.getElementsByTagName(tagName)
document.querySelector(query)
document.querySelectorAll(query)
element.childNodes[i]
element.lastChild
element.firstChild
```

## 元素之间插入节点

```js
document.body.insertBefore(h1Ele, document.body.firstChild)
```

## 创建很多元素

```js
const data = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
const table = document.createElement('table')
data.forEach((row) => {
  const tr = document.createElement('tr')
  row.forEach((col) => {
    const td = document.createElement('td')
    td.textContent = col
    tr.appendChild(td)
  })
  table.appendChild(tr)
})
document.body.appendChild(table)
```

## 更新元素的操作

```js
const table = document.createElement('table')
document.body.appendChild(table)
updateTable(table, [
  [1, 2],
  [3, 4, 5],
  [6, 7, 8, 9]
])
setTimeout(() => {
  updateTable(table, [
    [1, 2, 3, 4],
    [5, 6, 7],
    [8, 9]
  ])
}, 1000)
function updateTable(table, data) {
  const rowLookup = table._lookup || (table._lookup = [])

  setChildren(table, updateRows(rowLookup, data))
}
function updateRows(rowLookup, rows) {
  return rows.map((row, y) => {
    const tr = rowLookup[y] || (rowLookup[y] = document.createElement('tr'))
    const cellLookup = tr._lookup || (tr._lookup = [])
    setChildren(tr, updateCells(cellLookup, row))
    return tr
  })
}
function updateCells(cellLookup, cells) {
  return cells.map((cell, x) => {
    const td = cellLookup[x] || (cellLookup[x] = document.createElement('td'))
    td.textContent = cell
    return td
  })
}
function setChildren(parent, children) {
  let traverse = parent.firstChild
  for (let i = 0; i < children.length; i++) {
    const child = children[i]

    if (child == null) {
      return
    }

    if (child === traverse) {
      traverse = traverse.nextSibling
    } else if (traverse) {
      parent.insertBefore(child, traverse)
    } else {
      parent.appendChild(child)
    }
  }

  while (traverse) {
    const next = traverse.nextSibling
    parent.removeChild(traverse)

    traverse = next
  }
}
```

这是什么魔法？这里发生了两件事：

- 1.这里有一个隐藏的元素 element.\_lookup = []，用来查找子元素（可能是一个有 id 的元素），用这个方法我们可以重复利用已经存在的 dom，更新他们
- 2.setChildren(parent, children)方法里有包含子元素的列表

你还可以用 setChildren 方法来 mount/unmount 子元素

```js
setChildren(login, [email, !forgot && pass])
```

这个想法的是来源于[RE:DOM](https://redom.js.org/)开源

欢迎 微信 搜索  **小荧说**  学习探索.

---
isTimeLine: true
title: Vue3的数据双向绑定的原理
date: 2022-02-18
recommend: -999
tags:
  - Vue
  - Vue3
categories:
  - 前端
---

# Vue3 的数据双向绑定的原理

**Vue**的双向绑定是指数据变化能引起界面的变化，界面数据的变化也能驱动数据的改变。

这个功能其实和单向数据流规范不一样，所以开始接触**Vue**的时候非常吸引我的一个功能。我们发现`Element UI`的表单也有大量使用`v-model`进行双向绑定。

双向绑定 其实 不是所有的**元素/组件**都支持的，目前`Vue`支持 `input`，`select`, `checkbox`, `radio` 和组件 利用 `v-model` 指令进行 双向绑定。

我以前对 双向绑定 这个功能有很大的一个疑惑：就是**双向绑定**为什么不会造成更新死循环？即 界面变化 -> 数据变化 -> 界面变化 -> 数据变化 -> ...

## `v-model`对表单元素进行双向绑定

由于不同的表单元素使用的内部指令是不一样的，我们就用`input`作为例子进行分析，其他的表单元素的双向绑定原理非常类似。

这一节涉及到 **指令** 和 **事件处理** 相关的知识点，如果不是太清楚的话，建议参阅我前面的两篇相关内容，否则有可能会有一些的疑惑。

### 案例分析

```js
<input v-model="value" />
<div>{{ value }}</div>

setup() {
  let value = ref("");
  return {
    value
  };
}
```

> 简单的几行代码实现了`input`表单元素和数据`value`的双向绑定功能。

### 代码分析

### 我们来看看渲染函数

```js
import {
  vModelText as _vModelText,
  createElementVNode as _createElementVNode,
  withDirectives as _withDirectives,
  toDisplayString as _toDisplayString,
  createTextVNode as _createTextVNode,
  Fragment as _Fragment,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock
} from 'vue'

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (
    _openBlock(),
    _createElementBlock(
      _Fragment,
      null,
      [
        _withDirectives(
          _createElementVNode(
            'input',
            {
              'onUpdate:modelValue': ($event) => (_ctx.value = $event)
            },
            null,
            8 /* PROPS */,
            ['onUpdate:modelValue']
          ),
          [[_vModelText, _ctx.value]]
        ),
        _createElementVNode(
          'div',
          null,
          _toDisplayString(_ctx.value),
          1 /* TEXT */
        ),
        _createTextVNode(' setup() { let value = ref(""); return { value }; }')
      ],
      64 /* STABLE_FRAGMENT */
    )
  )
}

// Check the console for the AST
```

> 我们分析`_withDirectives`函数，看到`input`生成的`VNode`使用了`_vModelText`这个内部指令，且添加了一个名为`onUpdate:modelValue`的事件处理的 pro 函数，`onUpdate:modelValue`函数用来修改`value`值；

### `vModelText`指令

```js
export const vModelText: ModelDirective<
  HTMLInputElement | HTMLTextAreaElement
> = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    // 获取到 vnode.props!['onUpdate:modelValue'] 对应的函数
    el._assign = getModelAssigner(vnode)

    const castToNumber = numbr || (vnode.props && vnode.props.type === 'number')

    // 如果 有lazy修饰符 监听 input 的 change 事件，否则监听 input 的 input 事件
    addEventListener(el, lazy ? 'change' : 'input', (e) => {
      let domValue: string | number = el.value
      if (trim) {
        // 如果有trim修饰符，则将 input的value进行去空格
        domValue = domValue.trim()
      } else if (castToNumber) {
        // 如果有number修饰符，或者 input 类型是 number类型，则把 input的value变成number类型
        domValue = toNumber(domValue)
      }
      // 然后进行参数的回调实现 界面 到 数据的更改
      el._assign(domValue)
    })
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    // 更新 'onUpdate:modelValue' 函数，因为有可能不会更新数据，所以
    el._assign = getModelAssigner(vnode)
    // 如果 input的值没变，不进行任何操作
    if (document.activeElement === el) {
      if (lazy) {
        return
      }
      if (trim && el.value.trim() === value) {
        return
      }
      if ((number || el.type === 'number') && toNumber(el.value) === value) {
        return
      }
    }

    const newValue = value == null ? '' : value
    // 更新值
    if (el.value !== newValue) {
      el.value = newValue
    }
  }
}
```

> - `created`钩子函数中，如果有`lazy`修饰符，`input`表单监听**change**事件，否则监听**input**事件；
> - `beforeUpdate`钩子函数中，要重新获取`onUpdate:modelValue`函数，因为重新渲染函数可能更改了这个函数，并且重新给`input`赋值；
> - `input`中输入新的内容后，如果有`trim`修饰符就进行去空格，如果有有`number`修饰符或者 `input`类型是`number`类型需要转换成**number**，然后通过`onUpdate:modelValue`对应的函数修改`value` 值。

> 总结:
>
> 1. 数据->DOM: 响应式数据`value`变化触发组件更新，**input**的内容将发现变化;
> 2. DOM->数据: `vModelText`指令实现了对**input**的`value`变化的监听，根据`vModelText`指令的修饰符处理完**input**的`value`值，然后通过`onUpdate:modelValue`对应的函数`$event => (value = $event)`，重新完成响应式数据`value`的修改。响应式数据的修改会触发组件更新。

### 思考一下

### 为什么不会出现更新循环呢

**input**输入数据 -> 数据处理 -> 调用`onUpdate:modelValue`对应的`$event => (inputValue = $event)`方法 -> 响应式数据变化组件更新 -> **input**设置更新`input.value = newValue`**更新至此停止**。

![](http://cdn.xxycode.top/202202012049938.png)

### 为什么更新`input`的新值放在`vNodelText`指令的`beforeUpdate`中执行？

指令的更新有两个方式：`beforeUpdate`和`updated`。在`beforeUpdate`中执行有两个优势：

1. 在更新 DOM 前更新`input`的新值，如果只修改了`input`值，就省去了`patchProp`的部分操作，提高了`patch`性能。

2. 指令的`beforeUpdate`是 DOM 更新前，而`updated`钩子函数是在 DOM 更新后**异步执行**的，如果业务复杂同步任务太多的情况下可能出现更新延迟或者卡顿的现象。

### `v-model`对组件进行双向绑定

```js
<Son v-model="modalValue" />
```

其实等同于

```js
<Son :modalValue="modalValue" @update:modalValue="modalUpdate=$event.target.value"/>
```

> `v-model`对组件进行双向绑定 本质上就是一个语法糖，通过`prop`给子组件传递数据， 子组件通过`v-on`进行时间绑定可以进行数据修改

如果希望自定义 model 参数

```js
<Son v-model:visible="visible"/>
setup(props, ctx){
    ctx.emit("update:visible", false)
}
```

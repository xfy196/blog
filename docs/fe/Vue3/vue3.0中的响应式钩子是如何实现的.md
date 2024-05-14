---
isTimeLine: true
title: vue3.0中的响应式钩子是如何实现的
date: 2021-04-29
tags:
  - Vue
  - Vue3
categories:
  - 前端
---

### 先来聊聊`Vue3.0`的变化

Vue3.0 相比 Vue2.0 发生了翻天覆地的变化，从设计理念，到架构模式都发生了变化，笔者列入最核心的变化

- diff 设计变化，将 dom 渲染做到极致
- 优化静态变量提升，提高无效的 dom 渲染
- 监听缓存机制，让重复的数据流操作消失
- 组合式的 API，然代码的耦合度更低
- 重写 object.defineproperty()的数据双向绑定,使用 Proxy 代理重写

> 划重点，今天我们聊的只是基于 Proxy 实现的响应式代理

默认大家已经明白`Proxy`的原理是什么，如果大家还不太了解 Proxy 的原理先请大家移步[阮一峰 Proxy 讲解](https://es6.ruanyifeng.com/#docs/proxy)

### shallowReactive 实现

首先我们先看看 shallowReactive 到底是个什么`创建一个响应式代理，它跟踪其自身 property 的响应性，但不执行嵌套对象的深层响应式转换 (暴露原始值)。(官网原话)`。由此我们能得到这个 hooks 实现的只会代理第一层。

代码实现

```js
function shallowReactive(obj) {
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, val) {
      obj[key] = val
      console.log('更新UI界面')
      return true
    }
  })
}
// 测试

let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = shallowReactive(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
// 只会代理第一层 所以只会出发一次更新ui操作
console.log(state)
/*
更新UI界面
{ a: '1', gf: { b: '2', f: { c: '3', s: [Object] } } }
*/
```

### shallowRef

> 概念 ：创建一个跟踪自身 `.value` 变化的 ref，但不会使其值也变成响应式的。

从官网的话中能够明白，实际上 shallowRef 与 shallowReactive 之间的区别就在于被 value 包裹了一层

代码实现:

```js
function shallowRef(val) {
  // 实现代码只需要shallowReactive拿过来那代理一次就可
  return shallowReactive({ value: val })
}
function shallowReactive(obj) {
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, val) {
      obj[key] = val
      console.log('更新UI界面')
      return true
    }
  })
}
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = shallowRef(obj)
// state.value.a = '1'
// state.value.gf.b = '2'
// state.value.gf.f.c = '3'
// state.value.gf.f.s.d = '4'
// 修改里面的值不会发生改变只能监听第一层
state.value = {
  a: '1',
  gf: {
    b: '2',
    f: {
      c: '3',
      s: {
        d: '4'
      }
    }
  }
}
console.log(state)
/*
更新UI界面
{ value: { a: '1', gf: { b: '2', f: [Object] } } }
*/
```

### shallowReadonly

> 概念：创建一个 proxy，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换 (暴露原始值)。

大致的意思就是只会做底层代理，同时这一层代理是不能够操作的, 其他层次的值可以修改但是不会被 proxy 代理

代码实现：

```js
// shallowReadonly只需要set函数中不要设置值
function shallowReadonly(obj) {
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, val) {
      console.warn(`${key} 只读，不能赋值`)
      return true
    }
  })
}
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = shallowReadonly(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
// 只会代理第一层 所以只会出发一次更新ui操作
console.log(state)
/*
a 只读，不能赋值
{ a: 'a', gf: { b: '2', f: { c: '3', s: [Object] } } }
*/
```

### reactive

> 概念：返回对象的响应式副本

和 shallowReactive 的区别是在于 reactive 是需要把所有的对象进行代理

代码实现:

```js
// 产生递归监听
function reactive(obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = reactive(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = reactive(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      console.log('更新UI界面')
      return true
    }
  })
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = reactive(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
console.log(state)
/*
更新UI界面
更新UI界面
更新UI界面
更新UI界面
{ a: '1', gf: { b: '2', f: { c: '3', s: [Object] } } }
*/
```

### ref

> 概念: 接受一个内部值并返回一个响应式且可变的 ref 对象。ref 对象具有指向内部值的单个 property `.value`。

基于`reactive`就可以实现

```js
function ref(obj) {
  return reactive({
    value: obj
  })
}
function reactive(obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = reactive(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = reactive(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      console.log('更新UI界面')
      return true
    }
  })
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = ref(obj)
state.value.a = '1'
state.value.gf.b = '2'
state.value.gf.f.c = '3'
state.value.gf.f.s.d = '4'
console.log(state)
/*
更新UI界面
更新UI界面
更新UI界面
更新UI界面
{ value: { a: '1', gf: { b: '2', f: [Object] } } }
*/
```

### readonly

> 概念：接受一个对象 (响应式或纯对象) 或 [ref](https://v3.cn.vuejs.org/api/refs-api.html#ref) 并返回原始对象的只读代理。只读代理是深层的：任何被访问的嵌套 property 也是只读的。

其实想要设置只读操作很简单，我们只需要在 Proxy 的 set 方法不去设置值即可

代码实现:

```js
function readonly(obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = readonly(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = readonly(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, value) {
      console.log(`${key} 只读， 不能赋值`)
      return true
    }
  })
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = readonly(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
console.log(state)
/*
a 只读， 不能赋值
b 只读， 不能赋值
c 只读， 不能赋值
d 只读， 不能赋值
{ a: 'a', gf: { b: 'b', f: { c: 'c', s: [Object] } } }
*/
```

上面所述基本就是 Vue3.0 响应式 hooks 基本的实现原理，具体 Vue3.0 是如何完成数据双向绑定，dom 渲染算法，请移步 [Vue3.0](https://github.com/vuejs/vue-next)

响应式的对象创建已经完成了，那么如何判断这个响应式对象的是那种类型创建的？

Vue3.0 也提供了`isRef, isReadonly,isReactive，isProxy`这些判断函数

我们也来简单的实现一下，实现这个钩子可能我们需要重写一下上面实现的 reactive 和 ref

### isRef

> 概念：检查值是否为一个 ref 对象。

代码实现

```js
function ref(target) {
  target = reactive(target)
  // 这里我们需要重写对象的get，set方法，设置value的key
  return {
    // 标识当前对象时ref对象
    _is_ref: true,
    // 保存target数据保存起来
    _value: target,
    get value() {
      console.log('劫持得到了读取数据')
      return this._value
    },
    set value(value) {
      console.log('劫持到了修改数据，', value)
      this._value = value
    }
  }
}
function reactive(obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = reactive(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = reactive(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      console.log('更新UI界面')
      return true
    }
  })
}
/**
 *
 * 判断是否为ref
 * @param {*} target
 * @returns
 */
function isRef(target) {
  return target && target._is_ref
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = ref(obj)
state.value.a = '1'
state.value.gf.b = '2'
state.value.gf.f.c = '3'
state.value.gf.f.s.d = '4'
console.log(isRef(state))
/*
劫持得到了读取数据
更新UI界面
劫持得到了读取数据
更新UI界面
劫持得到了读取数据
更新UI界面
劫持得到了读取数据
更新UI界面
true
*/
```

### isReadonly

> 概念：检查对象是否是由 [`readonly`](https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly)

代码实现

```js
function readonly(obj) {
  // obj._is_readonly = true 第一种方法
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = readonly(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = readonly(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      // 第二种处理方式
      if (key === '_is_readonly') return true
      return obj[key]
    },
    set(obj, key, value) {
      console.log(`${key} 只读`)
      return true
    }
  })
}
/**
 *
 * 判断是否为readonly
 * @param {*} target
 * @returns
 */
function isReadonly(target) {
  return target && target._is_readonly
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = readonly(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
console.log(state)
console.log(isReadonly(state.gf))
/*
a 只读
b 只读
c 只读
d 只读
{ a: 'a', gf: { b: 'b', f: { c: 'c', s: [Object] } } }
true
*/
```

### isReactive

> 概念：检查对象是否是由 [`reactive`](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive)

代码实现

```js
function reactive(obj) {
  // obj._is_reactive = true 这是一种方法

  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = reactive(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = reactive(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      // 这种第二种方法
      if (key === '_is_reactive') return true
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      console.log('更新UI界面')
      return true
    }
  })
}
/**
 *
 * 判断是否为reactive
 * @param {*} target
 * @returns
 */
function isReactive(target) {
  return target && target._is_reactive
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = reactive(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
console.log(isReactive(state.gf))
```

### isProxy

> 概念：检查对象是否是由 [`reactive`](https://v3.cn.vuejs.org/api/basic-reactivity.html#reactive) 或 [`readonly`](https://v3.cn.vuejs.org/api/basic-reactivity.html#readonly) 创建的 proxy。

代码实现

```js
function reactive(obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = reactive(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = reactive(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  obj._is_reactive = true
  return new Proxy(obj, {
    get(obj, key) {
      return obj[key]
    },
    set(obj, key, value) {
      obj[key] = value
      console.log('更新UI界面')
      return true
    }
  })
}
/**
 *
 * 判断是否为reactive
 * @param {*} target
 * @returns
 */
function isReactive(target) {
  return target && target._is_reactive
}
/**
 *
 * 判断是否为readonly
 * @param {*} target
 * @returns
 */
function isReadonly(target) {
  return target && target._is_readonly
}

function readonly(obj) {
  if (typeof obj === 'object') {
    if (obj instanceof Array) {
      // 如果是一个数组，取出数组中的每一元素，判断每一个元素是否又是一个对象
      // 如果又是一个对象需要包装成一个proxy
      obj.forEach((item, index) => {
        if (typeof item === 'object') {
          obj[index] = reactive(item)
        }
      })
    } else {
      // 如果是一个对象取出对象属性的一个去吃没判断对象属性的取值也需要包装成Proxy
      for (const key in obj) {
        let item = obj[key]
        if (typeof item === 'object') {
          obj[key] = reactive(item)
        }
      }
    }
  } else {
    console.warn(`${obj} is not object`)
  }
  return new Proxy(obj, {
    get(obj, key) {
      if (key === '_is_readonly') return true
      return obj[key]
    },
    set(obj, key, value) {
      console.log(`${key} 只读， 不能赋值`)
      return true
    }
  })
}

function isProxy(target) {
  return isReactive(target) || isReadonly(target)
}
// 测试
let obj = {
  a: 'a',
  gf: {
    b: 'b',
    f: {
      c: 'c',
      s: {
        d: 'd'
      }
    }
  }
}
let state = readonly(obj)
state.a = '1'
state.gf.b = '2'
state.gf.f.c = '3'
state.gf.f.s.d = '4'
console.log(isProxy(state.gf))
```

以上就是 Vue3.0 核心响应式对象创建和判断的方法了，关于 Raw 相关实现，比较简单就是保留了一份原始对象数据，具体实现后续会更新哈:face_with_thermometer:

> 总结：听完 VueConf 大会尤大神对 Vue3.0 的解析，我才觉得自己对 Vue3.0 的理解还是比较浅薄的，关于上面代码实现基本结合尤大神的思想和 Proxy 的原理从零实现，也会完成自己手动封装一个类 Vue 的框架

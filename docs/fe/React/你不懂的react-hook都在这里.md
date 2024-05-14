---
isTimeLine: true
title: 你不懂的react-hook都在这里
date: 2021-07-20
tags:
  - React
categories:
  - 前端
---

# Hooks 的基本使用

**Hooks 解决的问题**

1. 函数组件不能拥有自己的状态(state)。在 hooks 之前的函数组件是无状态的，都是通过 props 的来获取父组件的状态，但是 hooks 提供了 useState 来维护函数组件内部的状态。
2. 函数组件中不能监听组件的生命周期，useEffect 聚合了多个生命周期函数。
3. class 组件生命周期较为复杂(在 15 版本到 16 版本的变化大)
4. class 组件逻辑难以复用(HOC render props)

**hooks 对比 class 的好处**

1. **写法更加的简洁**

> class 组件

```js
class ExampleOfClass extends Component {
  constructor(props) {
    super(props)
    this.state = {
      count: 1
    }
  }
  handleClick = () => {
    let { count } = this.state
    this.setState({
      count: count + 1
    })
  }
  render() {
    const { count } = this.state
    return (
      <div>
        <p>you click {count}</p>
        <button onClick={this.handleClick}>点击</button>
      </div>
    )
  }
}
```

> hooks

```js
function ExampleOfHooks() {
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return (
    <div>
      <p>you click {count}</p>
      <button onClick={handleClick}>点击</button>
    </div>
  )
}
```

2. **业务代码更加聚合**

使用 class 组件经常会出现一个功能出现在两个生命周期函数内的情况，这样分开写有时候可能会忘记。比如：

```js
let timer = null
componentDidMount() {
    timer = setInterval(() => {
        // ...
    }, 1000)
}
// ...
componentWillUnmount() {
    if (timer) clearInterval(timer)
}
```

由于添加定时器和清除器是在两个不同的生命周期函数，中间可能会有很多其他的业务代码，所以可能清除定时器，如果在组件卸载时没有添加清除定时器的函数就可能会造成内存泄漏，网络一直在请求。

但是使用 hooks 可以让代码更加方便，方便我们管理，也不容易忘记。

```js
useEffect(() => {
    let timer = setInterval(() => {
        // ...
    }, 1000)
    return () => {
        if (timer) clearInterval(timer)
    }
}, [//...])
```

3. **逻辑复用方便**

class 组件在逻辑复用通常 render props 以及 HOC 两种方式.react hooks 提供了自定义来复用逻辑。

下面以获取鼠标在页面的位置的逻辑复用为例。

> class 组件 render props 方式复用

```js
import React, { Component } from 'react'

class MousePosition extends Component {
  constructor(props) {
    super(props)
    this.state = {
      x: 0,
      y: 0
    }
  }

  handleMouseMove = (e) => {
    const { clientX, clientY } = e
    this.setState({
      x: clientX,
      y: clientY
    })
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove)
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.handleMouseMove)
  }

  render() {
    const { children } = this.props
    const { x, y } = this.state
    return <div>{children({ x, y })}</div>
  }
}

// 使用
class Index extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <MousePosition>
        {({ x, y }) => {
          return (
            <div>
              <p>
                x:{x}, y: {y}
              </p>
            </div>
          )
        }}
      </MousePosition>
    )
  }
}

export default Index
```

> 自定义 hooks 复用

```js
import React, { useEffect, useState } from 'react'

function usePosition() {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e
    setX(clientX)
    setY(clientY)
  }

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  })
  return [{ x, y }]
}

// 使用
function Index() {
  const [position] = usePosition()
  return (
    <div>
      <p>
        x:{position.x},y:{position.y}
      </p>
    </div>
  )
}

export default Index
```

可以很明显的看出使用 hooks 对逻辑复用更加的方便，使用的时候逻辑也更加清晰。

# hooks 常见的一些 API 使用

1. **useState**

> 语法

`const [value, setValue] = useState(0)`

这种语法方式是 ES6 的数据结构，数组的第一个值声明的状态，第二个值是状态改变函数。

> 每一帧都有独立的状态

个人理解针对每一帧独立状态是采取了闭包的方法来实现的。

```js
function Example() {
  const [val, setVal] = useState(0)
  const timeoutFn = () => {
    setTimeout(() => {
      // 取得的值是点击按钮的状态，不是最新的状态
      console.log(val)
    }, 1000)
  }
  return (
    <>
      <p>{val}</p>
      <button onClick={() => setVal(val + 1)}>+</button>
      <button onClick={timeoutFn}>alertNumber</button>
    </>
  )
}
```

当组件的状态或者 props 更新是，该函数组件会被重新调用渲染，并且每一次的渲染是独立的都有自己独立的 props 以及 state，不会影响其他的渲染。

**useState 初步实现**

```js
let lastState
function useState(initialState) {
  lastState = lastState || initialState
  function setState(newState) {
    lastState = newState
    render()
  }
  return [lastState, setState]
}
// 每次 render 的时候讲 state 的index 重置为 0

function render() {
  index = 0
  ReactDOM.render(<App />, document.getElementById('root'))
}
```

通过扇面的代码可以看出,`state`和`index`是强关联关系，因此，不能再`if，while`等判断条件下使用`setSate`，不能会导致`state`更新错乱。

2. useEffect

> 语法

```js
useEffect(() => {
    //handler function...

    return () => {
        // clean side effect
    }
}, [//dep...])

```

useEffect 接收一个回调函数以及依赖项，当依赖项发生变化时才会执行里面的回调函数。useEffect 类似于 class 组件的 didMount、didUpdate、willUnmount 的生命周期函数。

> 注意点

1. useEffect 是异步的在组件渲染完成后才会执行
2. useEffect 的回调数只能返回一个清除副作用的处理函数或者不返回
3. 如果 useEffect 传入的依赖项是空数组那么 useEffect 内部的函数只会执行一次

**实现 useEffect**

```js
let lastDependencies
function useEffect(callback, dependencies) {
  if (lastDependencies) {
    let changed = !dependencies.every(
      (item, index) => item == lastDependencies[index]
    )
    if (changed) {
      callback()
      lastDependencies = dependencies
    }
  } else {
    // 首次渲染
    callback()
    lastDependencies = dependencies
  }
}
```

3. **useMemo，useCallback**

useMemo 和 useCallback 主要用于减少组件的更新次数、优化组件性能的。

1. useMemo 接收一个回调函数以及依赖项，只有依赖项变化时才会重新执行回调函数。
2. useCallback 接收一个回调函数以及依赖项，并且返回该函数的 memorize 版本，只有在依赖项重新发生变化的时才会重新计算新的 meorize 版本

> 语法

```js
const memoDate = useMemo(() => data, [//dep...])
const memoCb = useCallback(() => {//...}, [//dep...])
```

在优化组件性能是针对 class 组件我们一般使用 React.PureComponent，PureComponent 会在 shouldUpdate 进行一次比较，判断时候需要更新；针对函数组件我们一般使用 React.memo。但是在使用 react hooks 时由于每一次渲染更新都是独立的(生成了新的状态)，即使使用了 React.memo，页还是重新渲染。

> 比如下面这种场景，改变子组件的 name 值后由于父组件更新后每次都会生成新值（addAge 函数会改变）,所以子组件也会重新渲染。

```js
function Parent() {
  const [name, setName] = useState('cc')
  const [age, setAge] = useState(22)

  const addAge = () => {
    setAge(age + 1)
  }

  return (
    <>
      <p>父组件</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>age: {age}</p>
      <p>-------------------------</p>
      <Child addAge={addAge} />
    </>
  )
}

const Child = memo((props) => {
  const { addAge } = props
  console.log('child component update')
  return (
    <>
      <p>子组件</p>
      <button onClick={addAge}>click</button>
    </>
  )
})
```

> 使用 useCallback 优化

```js
function Parent() {
  const [name, setName] = useState('cc')
  const [age, setAge] = useState(22)

  const addAge = useCallback(() => {
    setAge(age + 1)
  }, [age])

  return (
    <>
      <p>父组件</p>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <p>age: {age}</p>
      <p>-------------------------</p>
      <Child addAge={addAge} />
    </>
  )
}

const Child = memo((props) => {
  const { addAge } = props
  console.log('child component update')
  return (
    <>
      <p>子组件</p>
      <button onClick={addAge}>click</button>
    </>
  )
})
```

只有 useCallback 的依赖发生变化时，才会重新生成 memorize 函数。所以当改变 name 的状态是 addAge 不会变化。

**实现 useMemo，ueCallBack**

主要功能：缓存变量值，因此返回的是一个函数的返回值

```js
let lastMemo
let lastMemoDependencies
function useMemo(callback, dependencies) {
  if (lastMemoDependencies) {
    // 更新时渲染
    // 判断依赖是否改变
    let changed = !dependencies.every(
      (item, index) => item == lastMemoDependencies[index]
    )
    if (changed) {
      lastMemo = callback()
      lastMemoDependencies = dependencies
    }
  } else {
    // 初始化
    lastMemo = callback()
    lastMemoDependencies = dependencies
  }
  return lastMemo
}
```

实现 useCallBack

主要功能: 缓存函数

```js
let lastCallback
let lastCallbackDependencies
function useCallback(callback, dependencies) {
  if (lastCallbackDependencies) {
    // 更新时渲染
    // 判断依赖是否改变
    let changed = !dependencies.every(
      (item, index) => item == lastCallbackDependencies[index]
    )
    if (changed) {
      lastCallback = callback
      lastCallbackDependencies = dependencies
    }
  } else {
    // 初始化
    lastCallback = callback
    lastCallbackDependencies = dependencies
  }
  return lastCallback
}
```

5. **useRef**

useRef 类似于 react.createRef。

```js
const node = useRef(initRef)
```

useRef 返回一个可变的 ref 对象器 current 属性被初始化为传入的参数(initRef)

> 作用在 DOM 上

```js
const node = useRef(null)
<input ref={node}/>
```

这样的可以通过 node.current 属性访问到该 DOM 元素

需要注意的是**useRef 创建的对象在组件的整个生命周期内保持不变**,也就是说每次重新渲染函数组件时，返回的 ref 对象都是每一个(使用 React.createRef，每次重新渲染组件都会重新创建 ref)

**useRef 的实现**

```js
let lastRef
function useRef(initialRef) {
  lastRef = lastRef || initialRef
  return {
    current: lastRef
  }
}
```

6. **useReducer**

useReducer 类似于 redux 中的 reducer

> 语法

```js
const [state, dispatch] = useReducer(reducer, initState)
```

useReducer 传入一个计算函数和初始化 state，类似于 redux，通过返回的 state 我们可以访问状态，通过 dispatch 可以针对状态作修改。

```js
const initstate = 0
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { number: state.number + 1 }
    case 'decrement':
      return { number: state.number - 1 }
    default:
      throw new Error()
  }
}
function Counter() {
  const [state, dispatch] = useReducer(reducer, initstate)
  return (
    <>
      Count: {state.number}
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
    </>
  )
}
```

**自定义 useReducer**

```js
let lastState
function useReducer(reducer, initialState) {
  lastState = lastState || initialState
  function dispatch(action) {
    lastState = reducer(lastState, action)
    render()
  }
  return [lastState, dispatch]
}
```

7. **useContext**

通过 useContext 我们可以更加方便的获取上层组件提供的 context

> 父组件

```js
import React, { createContext, Children } from 'react'
import Child from './child'

export const MyContext = createContext()

export default function Parent() {
  return (
    <div>
      <p>Parent</p>
      <MyContext.Provider value={{ name: 'cc', age: 21 }}>
        <Child />
      </MyContext.Provider>
    </div>
  )
}
```

> 子组件

```js
import React, { useContext } from 'react'
import { MyContext } from './parent'

export default function Parent() {
  const data = useContext(MyContext) // 获取父组件提供的context
  console.log(data)
  return (
    <div>
      <p>Child</p>
    </div>
  )
}
```

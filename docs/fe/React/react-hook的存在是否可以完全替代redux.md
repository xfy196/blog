---
isTimeLine: true
title: react-hook的存在是否可以完全替代redux
date: 2021-02-08
tags:
  - React
categories:
  - 前端
---

## 前文

react-redux 主要提供的功能是将 redux 和 react 的组件关联起来。使用提供的 connect 方法可以使得任意一个 react 组件获取到全局的 store。 实现方法是将 store 存放于由 provider 提供的 context 上，在调用 connect 时， 就可将组件的 props 替换， 让其可以访问到定制化的数据或者方法。

## 目标

本文尝试使用 react-hook 来替代 react-redux 的基本功能。

react-redux 的特点：

- 全局维护一个 store
- 任何组件都可以获得 store，最好 props 可以定制(mapStateProps)
- 提供 action 的派发能力(mapStateDispatch)

**useReducer**

先看一下他的内置能力是什么，官网的案例会可我们一些启示能力(也是 useState 的替代方案)。

```jsx
const initialState = { count: 0 }

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 }
    case 'decrement':
      return { count: state.count - 1 }
    default:
      throw new Error()
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </>
  )
}
```

这么看来实际上 hook 拥有了可以使用 redux 的机制，状态的派发改变的 action，单向的数据流。但是 hook 不会状态共享，也就是每次 useReducer 保持是数据状态都是独立的。比如下面这个例子：

```jsx
function CountWrapper() {
    return (
        <section>
            <Counter initialCount={1}/>
            <Counter initialCount={1}/>
        </setion>
        )
}
```

两个 Count 组件内部的数据是独立的，无法互相影响，状态管理也就是无法说起。本身 useReducer 就是使用 useState 进行封装实现的。

```jsx
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState)

  function dispatch(action) {
    const nextState = reducer(state, action)
    setState(nextState)
  }

  return [state, dispatch]
}
```

**StorePriovider**

useReducer 实际上不能替代 react-redux 的全局共享机制，按照 react-redux 的实现方式来看，是因为提供了一个 Provider，使用 context 的方式来做的，这里使用 useContext 来弥补这个问题

> Accepts a context object (the value returned from React.createContext) and returns the current context value, as given by the nearest context provider for the given context. When the provider updates, this Hook will trigger a rerender with the latest context value.

它本身接收的是一个 React.createContext 的上下文对象，当 provider 更新时，会传入 store 更新时，useContext 就可以返回最新的值

```jsx
import { createContext, useContext } from 'react'

const context = createContext(null)
export const StoreProvider = context.provider

const store = useContext(context)
```

**useDispatch**

到这里我们提供了一个根组件来 store， 当 store 更新时，我们也可以利用 useContext 也可以拿到最新的值。这个时候暴露出一个 hook 来返回 store 上的 dispatch 即可派发 action，来更改 state。

```jsx
export function useDispatch() {
  const store = useContext(Context)
  return store.dispatch
}
```

**useStoreState**

接下来着眼于组件拿到 store 上数据的问题，这个其实也很简单，我们都把 store 拿到了，编写一个自定义 hook 调用了 store.getStore()即可拿到全局的状态。

```jsx
export function useStoreState(mapState) {
  const store = useContext(context)
  return mapState(store.getStore())
}
```

这里虽然是把状态拿到了，但忽略了一个非常重要的问题， 当 store 上的数据变化时，如何通知组件再次获取新的数据。当 store 变化过后，并没有和视图关联起来。另一个问题是没有关注 mapState 变化的情况。 针对第一个问题，我们可以利用 useEffect 这个内置 hook，在组件 mount 时完成在 store 上的订阅，并在 unmont 的时候取消订阅。 mapState 的变更可以使用 useState 来监听， 每次有变更时就执行向对应的 setter 方法。代码如下

```jsx
export function useStoreState(mapState) {
  const store = useContext(context)

  const mapStateFn = () => mapState(store.getState())

  const [mappedState, setMappedState] = useState(() => mapStateFn())

  // If the store or mapState change, rerun mapState
  const [prevStore, setPrevStore] = useState(store)
  const [prevMapState, setPrevMapState] = useState(() => mapState)
  if (prevStore !== store || prevMapState !== mapState) {
    setPrevStore(store)
    setPrevMapState(() => mapState)
    setMappedState(mapStateFn())
  }

  const lastRenderedMappedState = useRef()
  // Set the last mapped state after rendering.
  useEffect(() => {
    lastRenderedMappedState.current = mappedState
  })

  useEffect(() => {
    // Run the mapState callback and if the result has changed, make the
    // component re-render with the new state.
    const checkForUpdates = () => {
      const newMappedState = mapStateFn()
      if (!shallowEqual(newMappedState, lastRenderedMappedState.current)) {
        setMappedState(newMappedState)
      }
    }

    // Pull data from the store on first render.
    checkForUpdates()

    // Subscribe to the store to be notified of subsequent changes.
    const unsubscribe = store.subscribe(checkForUpdates)

    // The return value of useEffect will be called when unmounting, so
    // we use it to unsubscribe from the store.
    return unsubscribe
  }, [store, mapState])
  return mappedState
}
```

ok,从这里来看，react-hook 的确可以替代 react-redux，自己通过简单的封装基本完成了 react-redux 大部分的功能，但是，换一个场景来说，在大型 web 服务场景中，react-redux 的优化策略和考虑的场景，包括和第三方的框架继承，例如[immutable-js](https://github.com/immutable-js/immutable-js)， [redux-thunk](https://github.com/reduxjs/redux-thunk)，[redux-saga](https://github.com/redux-saga/redux-saga)。这样的优化方案，如果你需要自己做集成实现可能成本较高，同时无法考虑全面和对大型 web 服务的有精准的定位。而且最新的 react 生态产生的 react-server-compoents 服务端组件渲染技术，将会减少大量的数据渲染，数据处理的成本，也会在数据维护和性能优化做到一个质的飞跃。但是，中小型的 web 项目还需要使用 react-redux 么？实际上不太需要，绝大数据的中小型的 web 系统，没有太多的复杂交互场景和异步问题，可能只需要借助 react-dom 和 axios 就可以完成整个项目的开发了。

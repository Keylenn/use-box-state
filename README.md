# use-box-state

<a href="https://www.npmjs.com/package/use-box-state"><img alt="NPM version" src="https://img.shields.io/npm/v/use-box-state.svg"></a>
<a href="https://unpkg.com/use-box-state"><img alt="Size" src="https://img.badgesize.io/https://unpkg.com/use-box-state"></a>
<a href="https://www.npmjs.com/package/use-box-state"><img alt="NPM downloads" src="https://img.shields.io/npm/dm/use-box-state.svg"></a>


<table>
  <thead>
    <tr>
      <th colspan="3">🎯 案例🎯</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="https://codesandbox.io/s/counter-jsp5sv?file=/src/App.tsx" rel="nofollow">Counter 🧮</a></td>
      <td><a href="https://codesandbox.io/s/todos-iqpt4d?file=/src/App.tsx" rel="nofollow">Todos 📝</a></td>
    </tr>
  </tbody>
</table>
<br />


## ✨特性
+ 轻量，API简单化，支持快速跨组件共享状态
+ 支持异步action，修改状态简单化
+ 支持读写分离，更新粒度精确化
+ 用法接近原生的[useState](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)，类型提示友好


## 📦 安装

npm:

```sh
npm i use-box-state
```

pnpm:

```sh
pnpm i use-box-state
```


## ⚡快速开始

```tsx
import useBoxState, { createBox } from "use-box-state"

const counterBox = createBox(0)


function Counter() {
   const [count, setCount] = useBoxState(counterBox)
  return (
    <div>
      count:{count}
      <button onClick={() => setCount(count + 1)}>
        +
      </button>
    </div>
  )
}

export default Counter

```

## 💡API
### ```createBox(initialState)```
createBox接收初始状态作为参数，返回一个Box对象。

### ```useBoxState(box [, mapStateFn])```
useBoxState接收上面createBox⬆️创建的Box对象和可选的[mapStateFn](#mapStateFn)函数作为参数, 返回和[useState](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)基本一致，一个state，以及更新state的函数。通过这种方式在状态变更会订阅更新。


#### ```mapStateFn```
mapStateFn以state作为参数，返回自定义的状态，可用来定制更新和衍生状态，在状态改变时会对前后两次状态进行浅比较，有变化式才会更新。

```tsx
const nameInfoBox = createBox({
  familyName: 'sun',
  givenName: 'wukong'
})

function NameInfo() {
  const [nameInfo, setNameInfo] = useBoxState(nameInfoBox)
  // 定制更新
  const [givenName, setNameInfo] = useBoxState(nameInfoBox, s => s.givenName)
  // 衍生状态
  const [fullName, setNameInfo] = useBoxState(nameInfoBox, s => `${s.givenName} ${s.familyName}`)
  return (
      <>
        <p>familyName: {nameInfo.familyName}</p>
        <p>givenName: {givenName}</p>
        <p>fullName: {fullName}</p>
        {fullName}
      </>
  )
}
```


### ```useSetBoxState(box)```
useSetBoxState接收上面createBox⬆️创建的Box对象作为参数，返回一个更新状态的函数，这种方式不会订阅更新，用法和[useState](https://zh-hans.reactjs.org/docs/hooks-reference.html#usestate)返回的的第二个参数```setState```一致 。



## 🧐 设计动机

在React中，我们一般如何实现组件间的状态共享呢？本质上就是状态提升。

常见的做法，对于层级不深的组件，将共享状态提升到最近的公共父组件；对于全局组件树，使用Context在组件树间进行状态传递。

上面提到的场景和对应做法，在特定的场景下都有这很明显的弊端，因此我们可以试图设计一种实现状态提升的```折衷```方案，抽离组件间需要共享的状态，构建一个的公共的“虚拟组件Box”，将共享状态提升到Box中进行集中管理，于是```use-box-state```应运而生。


> 在上面👆 我们提到了“虚拟组件”、“数据流”等，为了更好的对比这些场景和方案，这里我们需要引入React官网的一个比喻：
如果你把一个以组件构成的树想象成一个 props 的数据瀑布的话，那么每一个组件的 state 就像是在任意一点上给瀑布增加额外的水源，但是它只能向下流动。


| 场景🧩 | 方案🛠 | 优点✅ | 缺点❌ |
| :-----: | :----: | :----: | :----: |
| 层级组件 | 将共享状态提升到最近的公共父组件 | 简单、数据流清晰 | 层级过深的组件需要逐层透传、props、改造成本较大 |
| 全局组件树 | 使用Context在组件树间进行状态传递 | 相对简单（基于useContext） | 更新粒度太大、无法轻易实现读写分离 |
| 任何场景 | 构建虚拟组件 | 简单、快速 | 在数据流中新增了“看不见”的水源 |


## 🙋‍♂️ Q&A
#### 如何判断我是否需要使用use-box-state❓ 
和React一直推荐的那样，use-box-state推崇尽量地将状态内敛化，因此你不一定需要使用它；只有当你的层级组件/全局组件树在共享状态时出现上述👆 的缺点时，它才有登场的必要。简而言之，充分利用React内置的API将状态内敛到合适的层级，只在有必要的情况下，权衡场景后使用合适的状态管理工具~

#### 如何划分Box❓ 
没有限制，推荐通过组件功能模块划分，在实践过程中，建议先确定需要哪些组件需要共享状态，然后根据功能（视图UI）进行划分，一个简单有效的方法就是对Box进行规范化地命名。

#### 多个Box需要怎么放比较好管理❓ 
没有限制，如果你的目录结构是文件类型（api、components、pages...）去划分的，则推荐将box放到box文件夹中统一管理；如果你的目录结构是通过对应的功能模块（user、order...）去划分的，根据就近原则，推荐放到对应的功能模块中管理。




## 🏗 TODO 
+ 支持 React 18
+ 新增单元测试
+ 支持esm
+ 支持跨ifrme/应用通信
+ 新增devtools
+ 新增LOGO

// redux 的流程是 view-action-reducer-store
// 中间件加入之后 view-action-middleware-reducer-store
const logger = ({getState, dispath}) => next => action =>{
    console.log('【logger】即将执行:', action)
    let value = next(action)
    console.log('【logger】执行完成后 state:', getState())
    return value
}

export default function applyMiddleware(...middlewares) {
    return (createStore) => (reducer, preloadedState, enhancer) => {
      // 接收 createStore 参数
      var store = createStore(reducer, preloadedState, enhancer)
      var dispatch = store.dispatch
      var chain = []
  
      // 传递给中间件的参数
      var middlewareAPI = {
        getState: store.getState,
        dispatch: (action) => dispatch(action)
      }
  
      // 注册中间件调用链，并由此可知，所有的中间件最外层函数接收的参数都是{getState,dispatch}
      chain = middlewares.map(middleware => middleware(middlewareAPI))
      //compose 函数起到代码组合的作用：compose(f, g, h)(...args) 效果等同于 f(g(h(...args)))，具体实现可参见附录。从此也可见：所有的中间件最二层函数接收的参数为 dispatch，一般我们在定义中间件时这个形参不叫 dispatch 而叫 next，是由于此时的 dispatch 不一定是原始 store.dispatch，有可能是被包装过的新的 dispatch。
      dispatch = compose(...chain)(store.dispatch)
  
      // 返回经 middlewares 增强后的 createStore
      return {
        ...store,
        dispatch
      }
    }
  }

class _Promise {
  static PENGIND = 'PENDING'; // 准备状态常量
  static FULFILLED = 'FULFILLED'; // 成功状态
  static REJECTED = 'REJECTED'; //拒绝状态
  constructor(executor) {
    this.status = _Promise.PENGIND; // 定义promise 状态, 默认为 准备状态
    this.value = undefined; //     保存状态成功时传递的值
    this.reason = undefined; // 保存状态拒绝时传递的值
    this.onresolveCallbackS = []; // 保存状态成功的回调函数
    this.onRejectEdCallbackS = []; //保存状态拒绝的回调函数
    //用于class 默认使用严格模式, 所有需要手动绑定this
    const resolve = this.resolve.bind(this);
    const reject = this.reject.bind(this);
    try {
      executor(resolve, reject); // 传入两个方法
    } catch (error) {
      // 当executor报错时把 错误值传递给解决方法
      reject(error);
    }
  }
  resolve(value) {
    // 当状态为等待状态时改变promise实例状态为 成功
    if (this.status === _Promise.PENGIND) {
      this.status = _Promise.FULFILLED;
      this.value = value;
      // 异步执行then方法里的成功方法
      setTimeout(() => {
        this.onresolveCallbackS.map((callback) => callback.onFulfilled(this.value));
      });
    }
  }
  reject(reason) {
    // 当状态为等待状态时改变promise实例状态为拒绝
    if (this.status === _Promise.PENGIND) {
      this.status = _Promise.REJECTED;
      this.reason = reason;
      // 异步执行then方法里的拒绝方法,
      setTimeout(() => {
        //  把then里面的回调函数进行执行并传参
        this.onRejectEdCallbackS.map((callback) => callback.onRejected(this.reason));
      });
    }
  }
  //  默认返回 实例对象上的用于保存状态所对应的值, 实现then方法的穿透
  then(onFulfilled = () => this.value, onRejected = () => this.reason) {
    // 给then方法内的两个回调函数添加默认值
    //  如果传递参数的类型不是函数, 就抛出一个错误
    if (typeof onRejected !== 'function' || typeof onRejected !== 'function') {
      throw new Error('The argument type must be a function');
    }
    let promise = new _Promise((resolve, reject) => {
      //当状态为准备时, 将then内部的函数放在状态改变时执行
      if (this.status === _Promise.PENGIND) {
        this.onresolveCallbackS.push({
          onFulfilled: (value) => {
            // value 会接受promise状态改变时传递的值
            this.parse(promise, onFulfilled(value), resolve, reject);
          },
        });
        this.onRejectEdCallbackS.push({
          onRejected: (reason) => {
            this.parse(promise, onRejected(reason), resolve, reject);
          },
        });
      }
      //当Promise实例状态为成功时调用onfulfilled函数, 并传入实例对象上的value值
      if (this.status === _Promise.FULFILLED) {
        // 异步执行 then方法里的回调函数
        setTimeout(() => {
          this.parse(promise, onFulfilled(this.value), resolve, reject);
        });
      }
      if (this.status === _Promise.REJECTED) {
        this.parse(promise, onFulfilled(this.reason), resolve, reject);
      }
    });
    return promise; // 返回新的promise
  }
  // 解析promise 状态
  parse(promise, result, resolve, reject) {
    //
    if (promise === result) {
      // 对then 返回的值进行约束,不能返回自己的promise, 否者抛出错误
      throw new TypeError('Chaining cycle detected for promise #<Promise>');
    }
    try {
      // 状态执行时进行trycatch 捕获错误
      if (result instanceof _Promise) {
        // 如果状态改变执行方法返回的是一个promise
        result.then(
          (res) => resolve(res),
          (reason) => reject(reason),
        );
        // 因为res和rej 方法默认会执行,并传递参数, 所以我们可以简写成这种形式
        // result.then(resolve,reject)
      } else {
        resolve(result); // 改状态成功时返回的参数传递给下一个promise的resolve方法
      }
    } catch (error) {
      //当当一个promise发生错误时, 将错误抛给下一个promise的reject方法
      reject(error); // 将错误抛给onRejected 方法处理
    }
  }
  static resolve(value) {
    return new _Promise((resolve, reject) => {
      // 返回一个新的的promise
      if (value instanceof _Promise) {
        //判断传递的是否为一个promise
        value.then(resolve, reject); // 传递promise状态值
      } else {
        resolve(value);
      }
    });
  }
  static reject(reason) {
    return new _Promise((resolve, reject) => {
      reject(reason);
    });
  }
  static All(promises) {
    const values = []; // 用来保存 promise状态成功时定义的值
    return new _Promise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(
          (value) => {
            values.push(value);
            // 如果所有promise对应的状态都为成功,即他们的数组长度相同,
            if (values.length === promises.length) {
              resolve(values); //调用成功状态执行的回调函数 并传值
            }
          },
          (reason) => {
            reject(reason); // 调用拒绝状态执行的回调函数 并传值
          },
        );
      });
    });
  }
  static AllSettled(iterators) {
    const promises = Array.from(iterators);
    const num = promises.length;
    const settledList = new Array(num);
    let settledNum = 0;
  
    return new _Promise(resolve => {
      promises.forEach((promise, index) => {
        _Promise.resolve(promise)
          .then(value => {
            settledList[index] =  { status: "fulfilled", value } ;
            if (++settledNum === num) {
              resolve(settledList);
            }
          })
          .catch(error => {
            settledList[index] = { status: "rejected", reason: error };
            if (++settledNum === num) {
              resolve(settledList);
            }
            
          });
      });
    });
  }
  static Race(promises){
    return new _Promise((resolve, reject) => {
      promises.forEach((promise) => {
        _Promise.resolve(promise).then(resolve, reject)
      });
    });
  }
  static Retry(promise, num){
    return new Promise(function(resolve, reject){
      while(num>0){
          try{
                 const res = await promise;
                 resolve(res)
                 num = 0
           } catch(e){
                 if(!num) reject(e)
           }
           num --
       }
   })
    
  }
}

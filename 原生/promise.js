class myPromise {
  constructor(executor) {
    this.status = 'pending'; // fulfilled rejected
    this.value = undefined; // fulfilled状态时 返回的信息
    this.reason = undefined; // rejected状态时 拒绝的原因
    this.onResloveCallBacks = [];
    this.onRejectCallBacks = [];
    let changeStatus = (newStatus, value) => {
      if (this.status !== 'pending') {
        return;
      }
      this.status = newStatus;
      if (newStatus === 'fulfilled') {
        this.value = value;
      }
      if (newStatus === 'rejected') {
        this.reason === value;
      }
    };
    let reslove = (result) => {
      changeStatus('fulfilled', result);
    };
    let reject = (reason) => {
      changeStatus('rejected', reason);
    };
    try {
      executor(reslove, reject);
    } catch (error) {
      reject(error);
    }
  }

  static all(promiseArr) {}

  static race(promiseArr) {}

  //   static reslove() {}

  //   static reject() {}

  then(onReslove, onReject) {
    if (typeof onReject !== 'function' || typeof onReslove !== 'function') {
      return;
    }
    if (this.status === 'reject') {
      onReject.call(this);
    }
    if (this.status === 'resolve') {
      onReslove.call(this);
    }
    return this;
  }
}

let foo = new myPromise((reslove, reject) => {
  reslove(1);
}).then((res)=>{
    
});

console.log(foo);

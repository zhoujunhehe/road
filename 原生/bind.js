Funtion.prototype.mybind = function(context,args){
    context = context || window;
    let fn = this
    return (...args)=>{
        fn.call(context,...args)
    }
}


Function.prototype.bind = function (context) {
    // 调用 bind 的不是函数，需要抛出异常
    if (typeof this !== "function") {
      throw new Error("Function.prototype.bind - what is trying to be bound is not callable");
    }
    
    // this 指向调用者
    var self = this;
    // 实现第2点，因为第1个参数是指定的this,所以只截取第1个之后的参数
    var args = Array.prototype.slice.call(arguments, 1);
    
    // 创建一个空对象
    var fNOP = function () {};
    
    // 实现第3点,返回一个函数
    var fBound = function () {
        // 实现第4点，获取 bind 返回函数的参数
        var bindArgs = Array.prototype.slice.call(arguments);
        // 然后同传入参数合并成一个参数数组，并作为 self.apply() 的第二个参数
        return self.apply(this instanceof fNOP ? this : context, args.concat(bindArgs));
        // 注释1
    }
    
    // 注释2
    // 空对象的原型指向绑定函数的原型
    fNOP.prototype = this.prototype;
    // 空对象的实例赋值给 fBound.prototype
    fBound.prototype = new fNOP();
    return fBound;
}

// 注释1 ：

// 当作为构造函数时，this 指向实例，此时 this instanceof fBound 结果为 true ，可以让实例获得来自绑定函数的值，即上例中实例会具有 habit 属性。
// 当作为普通函数时，this 指向 window ，此时结果为 false ，将绑定函数的 this 指向 context
// 注释2 ：

// 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值，即上例中 obj 可以获取到 bar 原型上的 friend
// 至于为什么使用一个空对象 fNOP 作为中介，把 fBound.prototype 赋值为空对象的实例（原型式继承），这是因为直接 fBound.prototype = this.prototype 有一个缺点，修改 fBound.prototype 的时候，也会直接修改 this.prototype ；其实也可以直接使用ES5的 Object.create() 方法生成一个新对象，但 bind 和 Object.create() 都是ES5方法，部分IE浏览器（IE < 9）并不支
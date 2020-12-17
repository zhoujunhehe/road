/**
 * 双向数据绑定的意思就是, 数据与视图绑定,任意一方修改都会影响另一方
 */
let a = {
    value:1,
}
// ES5 实现
Object.defineProperty(a, 'value', {
    get: function() {
        return this.value;
    },
    set: function(newValue) {
        value = newValue;
        document.querySelector('.input').value = newValue;
        
    }
})

// ES6 实现
let aaa = new Proxy(a,{
    get: function(target,key,receiver) {
        return Reflect.get(target, key, receiver)
    },
    set: function(target, key, value, receiver){
        if(key==='value'){
            document.querySelector('.input').value = value;
        }
        return Reflect.set(target, key, value, receiver)
    }
})
a.value = 2
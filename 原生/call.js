Funtion.prototype.mycall = function(context,...args){
    context = context || window;
    const fn = new Symbol()
    context[fn] = this
    let result = context[fn](...args)
    Reflect.deleteProperty(context,'fn')
    return result 
}
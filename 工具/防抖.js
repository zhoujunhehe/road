
/**
 * 防抖函数 一段时间内触发同一个事件,只有最后一个会被真实触发,之前的会被取消, 类似于读条
 * @param {*} fn 
 * @param {*} delay 
 * @param {*} immediate 
 */
function debounce(fn,delay,immediate){
    let timer = null;
    let result = null;
    return function() {
        let args = arguments;
        if(timer){
            window.clearTimeout(timer)
        }
        if(immediate){
            //  如果timer为空,说明可以立即执行
            let callNow = !timer
            timer = setTimeout(() => {
                timer = null
            },delay);
            if(callNow){
                result =  fn.apply(this,args)
            }
        }else{
            timer =  setTimeout(() => {
                fn.apply(this,args)
            },delay);
        }
     return result
    }
}

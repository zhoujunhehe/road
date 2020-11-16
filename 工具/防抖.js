
/**
 * 防抖函数
 * @param {*} fn 
 * @param {*} delay 
 * @param {*} immediate 
 */
function debounce(fn,delay,immediate){
    let timer = Date.now();
    let _this = this
    return () => {
        let now = Date.now();
        let timeout;
        if(now - timer <= delay){
            window.clearTimeout(timeout)
            return
        }else{
            timeout =  setTimeout(() => {
                fn.call(_this)
            }, delay);
            timer = Date.now();
           
        }
    }

}
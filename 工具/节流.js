/**
 * 节流函数,
 * @param {*} fn  一段时间间隔内只触发一次,类似于公交车
 * @param {*} delay 
 */
function throttle(fn, delay) {
    let last, deferTimer
    return function (args) {
        let that = this
        let _args = arguments
        let now = +new Date()
        if (last && now < last + delay) {
            clearTimeout(deferTimer)
            deferTimer = setTimeout(function () {
                last = now
                fn.apply(that, _args)
            }, delay)
        }else {
            last = now
            fn.apply(that,_args)
        }
    }
}
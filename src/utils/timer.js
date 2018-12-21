/**
 * desc: 自动退出登录函数封装(废弃)
 * */
import debounce from 'lodash/debounce.js'

let timer
var body = document.querySelector('html')
export function startTimer () {
  timer = setTimeout(() => {
    clearEvent()
    console.log('时间过长，自动退出')
    window.authUser()
  }, 60 * 60 * 1000)
  body.addEventListener('click', debounceFn)
  body.addEventListener('keydown', debounceFn)
  body.addEventListener('mousemove', debounceFn)
  body.addEventListener('mousewheel', debounceFn)
}
function timerSignOut (event) {
  clearTimeout(timer)
  timer = setTimeout(() => {
    clearEvent()
    console.log('时间过长，自动退出')
    window.authUser()
  }, 60 * 60 * 1000)
}
let debounceFn = debounce(timerSignOut, 10000)

function clearEvent () {
  body.removeEventListener('click', debounceFn)
  body.removeEventListener('keydown', debounceFn)
  body.removeEventListener('mousemove', debounceFn)
  body.removeEventListener('mousewheel', debounceFn)
}


export function getShareParamter (key) {
  var arr = window.location.href.split('?')
  var param = ''
  if (arr.length > 2) {
    param = arr[2]
  } else if (arr.length > 1) {
    param = arr[1]
  }
  var regExp = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i')
  var match = param.match(regExp)
  return match ? decodeURIComponent(match[2]) : ''
}

export function objToHashStr (obj) {
  var list = []
  for (var key in obj) {
    if (obj[key] || obj[key] === 0 || obj[key] === false) {
      list.push(key + '=' + obj[key])
    }
  }
  return list.join('&')
}

export function toUrlHash (obj) {
  window.location.replace(window.location.origin + window.location.pathname + `#${objToHashStr(obj)}`)
}

export function getHashParamter () {
  let hash = window.location.hash
  let params = {}
  if (hash) {
    let str = hash.substr(1)
    let strs = str.split('&')
    for (let i = 0; i < strs.length; i++) {
      params[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
    }
  } else {
    params = {}
  }
  return params
}

export function list2map (list, key = 'value', value) {
  if (Object.prototype.toString.call(list) !== '[object Array]') {
    console.log(new Error('list2map：list必须为数组'))
    return {}
  }
  let map = {}
  list.forEach((item) => {
    if (value) {
      map[item[key]] = item[value]
    } else {
      map[item[key]] = item
    }
  })
  return map
}

// 得到input光标位置
export function getInputCursorPosition (element) {
  let cursorPos = 0
  if (document.selection) { // IE
    var selectRange = document.selection.createRange()
    selectRange.moveStart('character', -element.value.length)
    cursorPos = selectRange.text.length
  } else if (element.selectionStart || element.selectionStart === '0') {
    cursorPos = element.selectionStart
  }
  return cursorPos
}

export function setInputCursorPosition (tobj, spos) {
  if (spos < 0) {
    spos = tobj.value.length
  }
  if (tobj.setSelectionRange) { // 兼容火狐,谷歌
    setTimeout(function () {
      tobj.setSelectionRange(spos, spos)
      tobj.focus()
    }, 0)
  } else if (tobj.createTextRange) { // 兼容IE
    var rng = tobj.createTextRange()
    rng.move('character', spos)
    rng.select()
  }
}

// 向字符串中插入数据
export function insertString (str, insertStr, index) {
  if (index < str.length && (index || index === 0)) {
    var newstr = ''
    var tmp = str.substring(0, index)
    var estr = str.substring(index, str.length)
    newstr += tmp + insertStr + estr
    return newstr
  }
  return str + insertStr
}

/**
 * @description 打开全屏
 */
export const openFullScreen = function () {
  const html = document.documentElement
  if (html.requestFullscreen) {
    html.requestFullscreen()
  } else if (html.mozRequestFullScreen) {
    html.mozRequestFullScreen()
  } else if (html.webkitRequestFullScreen) {
    html.webkitRequestFullScreen()
  } else if (html.msRequestFullscreen) {
    html.msRequestFullscreen()
  }
}

/**
 * @description 关闭全屏
 */
export const exitFullScreen = function () {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitCancelFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  }
}

// 深拷贝对象
export function deepCopy (obj) {
  // 判断拷贝的数据类型
  // 初始化变量result 成为最终克隆的数据
  let result = ''
  let targetType = checkedType(obj)
  if (targetType === 'Object') {
    result = {}
  } else if (targetType === 'Array') {
    result = []
  } else {
    return obj
  }
  // 遍历目标数据
  for (let i in obj) {
    // 获取遍历数据结构的每一项值。
    let value = obj[i]
    // 判断目标结构里的每一值是否存在对象/数组
    if (checkedType(value) === 'Object' ||
      checkedType(value) === 'Array') { // 对象/数组里嵌套了对象/数组
      // 继续遍历获取到value值
      result[i] = deepCopy(value)
    } else { // 获取到value值是基本的数据类型或者是函数。
      result[i] = value
    }
  }
  return result
}

function checkedType (target) {
  return Object.prototype.toString.call(target).slice(8, -1)
}

export function isRealNum (val) {
  // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
  if (val === '' || val === null) {
    return false
  }
  if (!isNaN(val)) {
    return true
  } else {
    return false
  }
}

export function newline2br (text) {
  if (text) {
    return text.replace(/(\n)|(\r\n)/g, '<br />')
  }
  return ''
}

export function complementUrl (url) {
  if (!url) {
    return ''
  }
  if (!url.match(/(http:\/\/)|(https:\/\/)/)) {
    return 'http://' + url
  }
  return url
}

/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
export function numMulti (num1, num2) {
  var baseNum = 0
  try {
    baseNum += num1.toString().split('.')[1].length
  } catch (e) {
  }
  try {
    baseNum += num2.toString().split('.')[1].length
  } catch (e) {
  }
  return Number(num1.toString().replace('.', '')) * Number(num2.toString().replace('.', '')) / Math.pow(10, baseNum)
}

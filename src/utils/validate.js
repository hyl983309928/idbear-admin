
export let phoneReg = /(^[1][3,4,5,6,7,8,9][0-9]{9}$)|(^(\d{3,4}-)?\d{7,8}$)/

export let linkReg = /^((http|https):\/\/)?[\w\-]+(\.[\w\-]+)+([\S\-\.,@?^=%&:\/~\+#]*[\S\-\@?^=%&\/~\+#])?$/ // eslint-disable-line

/**
 * desc: element的input验证封装
 * */
export function validateMobile (rule, value, callback) {
  if (!value) {
    callback(new Error('请输入手机号码'))
  }
  var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
  if (myreg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的手机号码'))
  }
}

export function validatePhone (rule, value, callback) {
  if (!value) {
    callback(new Error('请输入电话号码'))
  }
  if (phoneReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的电话号码'))
  }
}

export function validateUrl (rule, value, callback) {
  if (!value) {
    callback(new Error('请输入链接'))
  }
  if (linkReg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入正确的链接地址'))
  }
}

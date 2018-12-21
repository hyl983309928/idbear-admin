/* eslint-disable */

export function photoCompress(file, config, callback) {
  var _this = this
  var ready=new FileReader()
  ready.readAsDataURL(file)
  ready.onload=function(){
    var re=this.result
    canvasDataURL(re, config, callback)
  }
}
function canvasDataURL(path, obj, callback){
  var img = new Image()
  img.src = path
  img.onload = function() {
    var that = this
    // 默认按比例压缩
    var quality = 0.7  // 默认图片质量为0.7
    // 图像质量
    if(obj.quality && obj.quality <= 1 && obj.quality > 0) {
      quality = obj.quality
    }
    var w = that.width,
      h = that.height,
      scale = w / h
    w = obj.width || w
    h = obj.height || (w / scale)
    w = w * quality
    h = h * quality
    //生成canvas
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')
    // 创建属性节点
    var anw = document.createAttribute("width")
    anw.nodeValue = w;
    var anh = document.createAttribute("height")
    anh.nodeValue = h;
    canvas.setAttributeNode(anw)
    canvas.setAttributeNode(anh)
    ctx.drawImage(that, 0, 0, w, h)
    // quality值越小，所绘制出的图像越模糊
    var base64 = canvas.toDataURL('image/jpeg', quality);
    // 回调函数返回base64的值
    var form = new FormData()
    var blob = convertBase64UrlToBlob(base64)
    callback(blob)
  }
}
function convertBase64UrlToBlob(urlData){
  var arr = urlData.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

export function downloadImg (base64, fileName = '下载') {
  if (!base64) {
    return
  }
  let aLink = document.createElement('a');
  let blob = convertBase64UrlToBlob(base64); //new Blob([content]);
  let evt = document.createEvent("HTMLEvents");
  evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob);
  aLink.click()
}

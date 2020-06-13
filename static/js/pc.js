// 页面初始化成功后
window.onload = function() {
  // 【全局】生成二维码
  let currentProtocol = window.location.protocol || 'http:'; // 获取当前页面协议
  let currentSearch = window.location.search                 // 获取当前页面参数
  QRCode.toDataURL(currentProtocol + '//' +window.location.host + currentSearch, { margin: 0 })
  .then(url => {
    $(".pIosQRcode").attr("src", url);     // 苹果版
    $(".pAndroidQRcode").attr("src", url); // 安卓版
  })
  // 【公共】安装教程
  $(".pInstallTutorial").click(function() {
    $(".pInstall").fadeIn(); // 显示教程
  })
  $(".pInstall .closeBtn").click(function() {
    $(".pInstall").fadeOut(); // 关闭教程
  })
}

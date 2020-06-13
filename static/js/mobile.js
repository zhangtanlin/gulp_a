// 【全局】请求下载接口
var initData = "";

// 【全局】请求 ios 下载地址请求
var timestamp = new Date().getTime(); // 获取当前时间戳
$.ajax({
  url: './tt.json?time=' + timestamp,
  type: 'GET',
  async: false,
  success: function(data){
    if (data.code === 200) {
      initData = data.data;
    }
   }
});

// 是否显示滚动到顶部
function isTop() {
  if (document.body.scrollTop == 0 && document.documentElement.scrollTop == 0) {
    document.getElementById("toTop").style.display = 'none';
  } else {
    document.getElementById("toTop").style.display = 'block';
  }
}

// 初始化轮播swiper
function initSwiper() {
  new Swiper('.swiper-container', {
    autoplay: {
      delay: 5000, // 1秒切换一次
    }, // 自动切换
    loop: true, // 是否循环
    pagination: {
      el: '.swiper-pagination' // 关联元素
    } // 指示灯参数配置
  });
}

/**
 * 从数组中随机取几个值
 * @param {Array}  arr   - 数组
 * @param {Nunber} count - 获取多少个值
 * @returns 一个含有值的数组或者……
 */
function getRandomElementsFromArray(arr, count) {
  var shuffled = arr.slice(0),
    i = arr.length,
    min = i - count,
    temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

/**
 * 获取数值段内的一个随机值
 * @param {int} min - 最小值
 * @param {int} max - 最大值
 * 例如：8 - 60 中的某个整数
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //含最大值，含最小值
}

// 定义banner图片
const bannerArray = [{
    src: getConfig().cdn + 'static/images/banner/banner1.jpg' + getConfig().version,
    url: ''
  },
  {
    src: getConfig().cdn + 'static/images/banner/banner2.jpg' + getConfig().version,
    url: ''
  },
  {
    src: getConfig().cdn + 'static/images/banner/banner3.jpg' + getConfig().version,
    url: ''
  },
  {
    src: getConfig().cdn + 'static/images/banner/banner4.jpg' + getConfig().version,
    url: ''
  }
];

// 定义视频封面图片
const videoArray = [{
    src: getConfig().cdn + 'static/images/video/video1.jpg' + getConfig().version,
    name: '苏馨月',
    age: '176E',
    videoName: '性感大咪，全能选手，可液体，可SM，可3通，真实97年，活好不事',
    playtime: 59865,
    status: 1,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video2.jpg' + getConfig().version,
    name: '妙妙',
    age: '173E',
    videoName: '北京极品，留学生，邻家小妹带你找回初恋的感觉',
    playtime: 59865,
    status: 1,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video3.jpg' + getConfig().version,
    name: 'Phoebe',
    age: '173',
    videoName: '海航空姐，体重95，D奶，潮喷。纯兼职，服务热情，态度温柔，无纹身，无疤痕，上下粉嫩，活好，对待客户像谈恋爱一样的',
    playtime: 59865,
    status: 0,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video4.jpg' + getConfig().version,
    name: '小桃子',
    age: '175大F',
    videoName: '可SM，wt，可管事yeti，一字马，蜜桃臀，支持各种验证',
    playtime: 59865,
    status: 1,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video5.jpg' + getConfig().version,
    name: '李露儿',
    age: '176D',
    videoName: '宝马御用模特，筷子退，蜜桃臀，肌肤雪白',
    playtime: 59865,
    status: 1,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video6.jpg' + getConfig().version,
    name: '妮妮',
    age: '98年170E',
    videoName: '纯新人，舞蹈系学生，可现场表演一字马，穿着大牌，青春洋气，真人真照，可视频验证，纯纯女友的感觉',
    playtime: 59865,
    status: 0,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video7.jpg' + getConfig().version,
    name: '肉包',
    age: '00年165E',
    videoName: '新人芭比娃娃，，声音甜美，皮肤雪白，水嫩多汁，假赔W，支持各种验证',
    playtime: 59865,
    status: 1,
    type: '约炮'
  },
  {
    src: getConfig().cdn + 'static/images/video/video8.jpg' + getConfig().version,
    name: '夜玫瑰',
    age: '173C',
    videoName: '南京师范大学在读学生，刚下水，舌头柔软，大长腿，好评多多，骨感类型，可以验证视频',
    playtime: 59865,
    status: 1,
    type: '约炮'
  }
];

// 定义评论信息列表
const commentArray = [{
    name: '安静的小白菜',
    time: '',
    src: getConfig().cdn + 'static/images/header/header1.jpg' + getConfig().version,
    text: 'APP不错呀，麻豆的视频都是免费的'
  },
  {
    name: '干净的黑夜',
    time: '',
    src: getConfig().cdn + 'static/images/header/header2.jpg' + getConfig().version,
    text: 'A头条上约了个极品嫩模，一晚上干了三炮，叫声真销魂，活好不事，好回味～～'
  },
  {
    name: '失眠等你',
    time: '',
    src: getConfig().cdn + 'static/images/header/header3.jpg' + getConfig().version,
    text: '好骚的逼，好想舔'
  },
  {
    name: '弓虽女干哥',
    time: '',
    src: getConfig().cdn + 'static/images/header/header4.jpg' + getConfig().version,
    text: 'A头条真牛逼，我想要的全都有，头条出品，果然精品！'
  },
  {
    name: '可爱闻眼睛',
    time: '',
    src: getConfig().cdn + 'static/images/header/header5.jpg' + getConfig().version,
    text: 'A头条potato群里每天的抽奖活动不错，已经中了2次现金红包了！'
  },
  {
    name: '美满的山水',
    time: '',
    src: getConfig().cdn + 'static/images/header/header6.jpg' + getConfig().version,
    text: '刚打开第一眼确实惊艳到我了，尤其是关于N号房、幼幼、强奸等官方声明，第一次看到一个成人平台有这样的立场，祝A头条越来越好！'
  },
  {
    name: '翻个鸡吧皮爽哟',
    time: '',
    src: getConfig().cdn + 'static/images/header/header7.jpg' + getConfig().version,
    text: '外围约炮服务不错，准备趁周末约一个玩玩'
  },
  {
    name: '扮猪吃老虎',
    time: '',
    src: getConfig().cdn + 'static/images/header/header8.jpg' + getConfig().version,
    text: '果然是我想要的头条，最新视频全都有，每天更新多多'
  }
];

/**
 * 当前是什么设备
 * @returns { android: 安卓, ios: 苹果, web: 浏览器 }
 */
function whichDevice() {
  var u = navigator.userAgent;
  var isiOS = /(iPhone|iPad|iPod|iOS)/i.test(u); //ios终端
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  if (isiOS) {
    return "ios";
  }
  if (isAndroid) {
    return "android";
  }
  return "web";
}

// 复制到粘贴板
function selectText(element) {
  var text = document.getElementById(element);
  if (document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else if (window.getSelection) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(text);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand("Copy")
  } else {
    alert("none");
  }
}

/**
 * 下载
 * @function getQueryVariable - 获取地址栏指定参数的值
 * @function ClipboardJS      - 复制指定数据到粘贴板
 * 流程： 1:获取地址栏 code 值，
 *       2:组合 'tt_' + code + "#" + channel 复制进粘贴板，
 *       3:如果是安卓就跳转apk下载地址，
 *         如果是 ios 就显示 ios 下载弹出框
 */
function mDownload() {
  selectText('copy');                            // 调用粘贴板
  var u = navigator.userAgent;
  var isiOS = /(iPhone|iPad|iPod|iOS)/i.test(u); //ios终端
  if (isiOS) {
    $(".iosDownloadPopup").css("display", "flex");
  } else {
    window.location.href = initData.url_android;
  }
}

  // 页面初始化
$(function () {

  // 下载按钮事件【非动态元素】
  $(".mHeader .btn").click(function(){
    mDownload();
  })

  // 下载按钮事件【动态元素】
  $("body").on("click", ".list, .swiper-container-img, .titleBox", function(){
    mDownload();
  })

  // ios 相关下载按钮事件
  $(".iosFreeUrl").click(function () {
    window.location.href = initData.url_ios_free;
  });
  $(".iosPreventUrl").click(function () {
    window.location.href = initData.url_ios_tf;
  });
  $(".iosStoreUrl").click(function () {
    window.location.href = initData.url_ios_super;
  });
  // 生成粘贴板内容
  let getCode = getQueryVariable("code") || ''; // 获取推荐码
  let getChannel = getQueryVariable("channel") || ''; // 获取渠道码
  let toSplice = 'tt_' + getCode + "#" + getChannel; // 拼接推荐码和渠道码
  $('#copy').text(toSplice); // 把内容添加到 dom 元素

  // 【全局】图片实现懒加载
  $("img").lazyload({
    effect: "fadeIn"
  });
  // 【全局】获取地址栏参数
  var query = window.location.search;
  // 【全局】是否是 ios 设备
  if (whichDevice() === 'ios') {
    $(".mNote .operating").eq(0).css("display", "flex"); // 【首页】显示 ios 教程按钮
    $(".mInstallBanner .tutorialBtn").eq(0).addClass("active"); // 【安装教程页】显示 ios 教程切换按钮
    $(".mInstallContent").eq(0).fadeIn(); // 【安装教程页】显示 ios 教程
  } else {
    $(".mNote .operating").eq(1).css("display", "flex"); // 【首页】显示安卓教程
    $(".mInstallBanner .tutorialBtn").eq(1).addClass("active"); // 【安装教程页】显示安卓教程切换按钮
    $(".mInstallContent").eq(1).fadeIn(); // 【安装教程页】显示安卓教程
  }


  // 【全局】ios 下载框关闭按钮事件
  $(".iosDownloadClose").click(function () {
    $(".iosDownloadPopup").fadeOut();
  })

  // 【全局】把地址参数设置进需要跳转的地址
  $(".mShowInstall").attr("href", "./install.html" + query); // 把参数添加到跳转安装教程跳转地址
  $(".mInstallHeader .back").attr("href", "./index.html" + query); // 把参数添加到安装教程头部返回按钮内

  /**
   * 【首页】banner列表
   * @function getBannerList - 从定义的 8 条数据中取出 4 条数据
   * @param bannerDom - 定义需要插入的 html 字段
   */
  var getBannerList = getRandomElementsFromArray(bannerArray, 4) || [];
  var bannerDom = "";
  if (getBannerList.length) {
    for (let iterator of getBannerList) {
      bannerDom += '<div class="swiper-slide">';
      bannerDom += '<img src="' + iterator.src + '" class="swiper-container-img">';
      bannerDom += '</div>';
    }
  }
  $("#swiperWrapperBox").html(bannerDom);

  // 【首页】轮播图【需要在 banner 拼接完成之后再初始化】
  initSwiper();

  /**
   * 【首页】视频封面列表
   * @function getVideoList - 从定义的 8 条数据中取出 4 条数据
   * @param {string} videoListDom - 定义需要插入的 html 字段
   */
  var getVideoList = getRandomElementsFromArray(videoArray, 4) || [];
  var videoListDom = "";
  if (getVideoList.length) {
    for (let iterator of getVideoList) {
      videoListDom += '<div class="list">';
      videoListDom += '<div class="imgbox">';
      videoListDom += '<img src="' + iterator.src + '">';
      videoListDom += '</div>';
      videoListDom += '<div class="infoBox">';
      videoListDom += '<div class="title">' + iterator.name;
      if (iterator.age) {
        videoListDom += '<span class="age">' + iterator.age + '</span>';
      }
      videoListDom += '</div>';
      videoListDom += '<div>';
      videoListDom += '<div class="inline">• ' + iterator.type + '</div>';
      videoListDom += '</div>';
      videoListDom += '</div>';
      videoListDom += '<div class="videoName">' + iterator.videoName + '</div>';
      videoListDom += '</div>';
    }
  }
  $("#mVideo").html(videoListDom);

  /**
   * 【首页】评论列表
   * @function getVideoList - 从定义的 8 条数据中取出 4 条数据
   * @param {string} commentDom - 定义需要插入的 html 字段
   * @param {number} globalInt  - 14 - 50 之间的一个整数
   */
  var getCommentList = getRandomElementsFromArray(commentArray, 4) || [];
  var commentDom = "";
  const globalInt = getRandomIntInclusive(14, 50);
  if (getCommentList.length) {
    for (let [index, iterator] of getCommentList.entries()) {
      let time = globalInt + index * 7 + '秒前';
      commentDom += '<div class="list">';
      commentDom += '<div class="logo">';
      commentDom += '<img src="' + iterator.src + '">';
      commentDom += '</div>';
      commentDom += '<div class="content">';
      commentDom += '<div class="titleBox">';
      commentDom += '<div class="name">' + iterator.name + '</div>';
      commentDom += '<div class="time">' + time + '</div>';
      commentDom += '</div>';
      commentDom += '<div class="text">' + iterator.text + '</div>';
      commentDom += '</div>';
      commentDom += '</div>';
    }
  }
  $("#mComment").html(commentDom);

  // 【安装教程】点击教程切换按钮切换（ios/android）教程
  $(".mInstallBanner .tutorialBtn").click(function () {
    var index = $(".mInstallBanner .tutorialBtn").index(this); // 获取当前按钮（.tutorialBtn）下标
    $(".mInstallBanner .tutorialBtn").removeClass("active"); // 【按钮样式】删除切换按钮样式
    $(this).addClass("active"); // 【按钮样式】给当前按钮添加样式
    $(".mInstallContent").fadeOut(); // 【教程列表】隐藏所有教程
    $(".mInstallContent").eq(index).fadeIn(); // 【教程列表】显示当前对应教程
  });

})

// 滚动条滚动时
window.onscroll = function () {
  isTop(); // 是否显示滚动到顶部
}
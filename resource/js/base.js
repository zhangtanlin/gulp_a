// 设置 cdn 地址
function getConfig() {
	// 本地
	return {
	 version: "?v=1.0.22",
		api: '',
		cdn: '/'
	};
	// // 正式
	// return {
	// 	version: "?v=1.0.22",
	// 	api: '',
	// 	cdn: '//sunsimiao.rf.gd'
	// }
}

// 微信/QQ打开使用弹出框提示
function verifyWeChatQQ() {
	let ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		//图片链接
		let imgSrc = getConfig().cdn + "static/images/openBrowser.png" + getConfig().version;
		// 添加 css 样式 + html
		document.write("<style>#we-chat-download-modal{width:100vw;height:100vh;position:fixed;top:0;left:0;z-index:100;background-color:rgb(0,0,0);display:flex;align-items:center;justify-content:center;}.we-chat-modal-img{width:70vw;}</style><div id=\"we-chat-download-modal\"><img class=\"we-chat-modal-img\" src=" + imgSrc + "></div>");
	}
}
// verifyWeChatQQ();


// 动态修改body的font-size（用来处理 rem 单位）
function resetBodyFontSize() {
	let htmlWidth = document.documentElement.clientWidth ||
	document.body.clientWidth; // 获取屏幕宽度(viewport)
	let htmlDom = document.getElementsByTagName('html')[0]; //获取htmlDom
	htmlDom.style.fontSize = htmlWidth/100+'px'; //设置html的font-size
	window.addEventListener('resize', (e) => {
		let htmlWidth = document.documentElement.clientWidth ||
			document.body.clientWidth;
		let htmlDom = document.getElementsByTagName('html')[0];
		htmlDom.style.fontSize = htmlWidth / 100 + 'px';
	}); // 屏幕改变时
}

resetBodyFontSize();

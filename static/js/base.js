// 设置 cdn 地址
function getConfig() {
	// 本地
	// return {
	//  version: "?v=1.0.22",
	// 	api: '',
	// 	cdn: '/'
	// };
	// 正式
	return {
		version: "?v=1.0.22",
		api: '',
		cdn: '//cdn1.att-st.me/'
	}
}

/**
 * 凯撒解密
 * @param {*} key   - 偏移量
 * @param {*} ctext - 被加密的字符串
 */
function do_decrypt(key, ctext) {
	var plain = "";
	for(var i = 0; i < ctext.length; i++) {
		var ccode = ctext.charCodeAt(i);
		var pcode = ccode;
		if(ccode >= 65 && ccode <= 90) {
			pcode = ((ccode - 65) - key * 1 + 26) % 26 + 65;
		}
		if(ccode >= 97 && ccode <= 122) {
			pcode = ((ccode - 97) - key * 1 + 26) % 26 + 97;
		}
		plain += String.fromCharCode(pcode);
	}
	return plain;
}

/**
 * 获取地址栏参数
 * @param {string} variable - 地址栏参数名
 */
function getQueryVariable(variable) {
	var query = window.location.search.substring(1);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if(pair[0] == variable){return pair[1];}
	}
	return(false);
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
verifyWeChatQQ();

// 添加debugger
function d(){
	eval(do_decrypt(5,'ijgzlljw'));
}

// 判定当前时间是否在时间段内
function time_range(beginTime, endTime) {
	var strb = beginTime.split (":");
	if (strb.length != 2) {
		return false;
	}
	var stre = endTime.split (":");
	if (stre.length != 2) {
		return false;
	}
	var b = new Date ();
	var e = new Date ();
	var n = new Date ();
	b.setHours (strb[0]);
	b.setMinutes (strb[1]);
	e.setHours (stre[0]);
	e.setMinutes (stre[1]);
	if (n.getTime () - b.getTime () > 0 && n.getTime () - e.getTime () < 0) {
		return true;
	} else {
		// alert ("当前时间是：" + n.getHours () + ":" + n.getMinutes () + "，不在该时间范围内！");
		return false;
	}
}

// 设置白名单
function setWhitelist() {
	var range = new Date().getTime();     // 获取当前时间戳
	var host = window.location.hostname;  // 获取当前界面域名【排出端口】
	return new Promise((resolve) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', './tt.json?time=' + range, false);
		xhr.responseType = "json";
		xhr.send();
		xhr.onload = () => {
			if (xhr.status == 200) {
				let s = false;
				for (const iterator of xhr.response.data.url_host) {
					if(do_decrypt(5, iterator) === host) {
						s = true;
						break;
					};
				}
				// 不在当前域名内 && 北京凌晨 2-8 && 取模 ===> 跳指定域名
				let isIn = time_range("02:00", "08:00");
				let isTrue  = Math.ceil(Math.random()*10) % 2 == 0; // 偶数
				if (!s && isIn && isTrue) {
					let currentProtocol = window.location.protocol || 'http:'; // 获取当前页面协议
					window.location.href = currentProtocol + '//' + do_decrypt(5, xhr.response.data.url_host[0]);
				}
				resolve();
			}
		};
	}).catch(() => {
		console.log("请求白名单失败")
	})
};
// setWhitelist();

// 防止打开控制台调试
// !function () {
// 	setInterval(d, 1000);
//  }();

// 判断是否按下 F12
// window.onkeydown = window.onkeyup = window.onkeypress = function (event) {
//   var e = event || window.event || arguments.callee.caller.arguments[0];
//   if (e && e.keyCode == 123) { // 判断是否按下F12，F12键码为123
//     e.preventDefault();        // 阻止默认事件行为
//     e.returnValue = false;
//     return (false);
//   }
// }

// 禁掉鼠标右键事件
// window.oncontextmenu = function() {
//   event.preventDefault(); // 阻止默认事件行为
//   return false;
// }

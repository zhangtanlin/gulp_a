// 适应
(function (doc, win) {
	var docEl = doc.documentElement,
		isIOS = navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
		dpr = isIOS ? Math.min(win.devicePixelRatio, 3) : 1,
		dpr = win.top === win.self ? dpr : 1, //被iframe引用时，禁止缩放
		dpr = 1,
		scale = 1 / dpr,
		resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
	docEl.dataset.dpr = dpr;
	var metaEl = doc.createElement('meta');
	metaEl.name = 'viewport';
	metaEl.content = 'initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale;
	docEl.firstElementChild.appendChild(metaEl);
	var recalc = function () {
		var width = docEl.clientWidth;
		if (width / dpr > 750) {
			width = 750 * dpr;
		}
		docEl.style.fontSize = 100 * (width / 350) + 'px';
	};
	recalc()
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
})(document, window);

// 处理变量
(function () {
	// 获取需要操作的全部元素 arguments 可以获取函数参数个数.
	let array_merge = function () {
		let tmp = [];
		for (let i = 0; i < arguments.length; i++) {
			for (let j = 0; j < arguments[i].length; j++) {
				tmp.push(arguments[i][j])
			}
		}
		return tmp
	},
		// 设置需要操作的元素.
		eleArr = array_merge(
			$("[v-data-clipboard-text]"),
			$("[v-href]"),
		)
	// 执行表达式,如果参数是js代码,eval将执行js代码.
	function getEval(val) {
		try {
			return eval(val);
		} catch (error) {
			return "";
		}
	};
	// 遍历-把变量设置为实际的值,并删除变量属性.
	for (let ele of eleArr) {
		if (ele.attributes.length) {
			for (let key of ele.attributes) {
				if (key.nodeName.indexOf('v-') === 0) {
					let val = getEval(key.nodeValue)
					if (val === "") {
						ele.style.display = 'none';
					} else {
						ele.setAttribute(key.nodeName.substring(2), val)
					}
					ele.removeAttribute(key.nodeName)
				}
			}
		}
	}
})();

// 处理路由
(function (doc, win) {
	// 路由历史记录,路由是否运行中.
	let historyStore = [], popRunning = false;
	// 路由操作
	var routerHandle = function (event) {
		if (event && !popRunning) {
			let pos = event.oldURL.indexOf('#');
			if (event.oldURL.indexOf('#') > -1) {
				historyStore.push(event.oldURL.substring(pos + 1))
			} else {
				historyStore.push('#')
			}
		}
		popRunning = false;
		// 获取自定义路由 (由于路由以 # 号开头).
		let router = location.hash,
			// 获取界面上的所有路由元素
			selectorAll = doc.querySelectorAll("div[routerName]");
		// 判定地址栏如果没有自定义的路由=>设置当前路由为首页.
		if (router.length <= 0) {
			router = "#index.html";
		}
		// 循环界面上的路由元素
		for (let index = 0; index < selectorAll.length; index++) {
			// 获取当前路由元素
			const element = selectorAll[index];
			if (element.attributes["routerName"].nodeValue !== router) {
				// 判定如果路由元素和路由不匹配
				element.style.display = "none";
			} else {
				// 判定如果路由元素和路由匹配
				element.style.display = "block";
				// 路由匹配之后加载图片
				let elements2 = element.querySelectorAll("img[lazy-loading]");
				for (let ele of elements2) {
					let src = ele.getAttribute('lazy-loading');
					ele.setAttribute('src', src)
					ele.removeAttribute('lazy-loading');
				}
			}
		}
	}
	// 初始化
	routerHandle();
	// 监听地址栏 hansh
	win.addEventListener('hashchange', routerHandle, false);
})(document, window);

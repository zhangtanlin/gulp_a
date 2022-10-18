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

// alter弹出框
var Alter = {
	show: function (text, callback) {
		var alterDocument = document.createElement('div');
		alterDocument.setAttribute('class', 'alter');
		var alterInnerHtml = `
			<div class="alter_background"></div>
			<div class="alter_box">
				<div class="alter_title">提示</div>
				<div class="alter_text">`+ text + `</div>
				<div class="public_btn alter_btn">
					<span class="alter_btn_text">确认</span>
					<div class="alter_btn_loading"></div>
				</div>
			</div>
		`;
		$(alterDocument).html(alterInnerHtml);
		$("body").append(alterDocument);
		$(".alter_box").animate({ 'opacity': 1 }, 200);

		$('.alter_background').on('click', function () {
			$('.alter_box').animate({ 'opacity': '0' }, 200);
			setTimeout(function () {
				$('.alter').remove();
			}, 200);
		});
		$(".alter_btn").on("click", function () {
			$(".alter_btn_text").hide()
			$(".alter_btn_loading").fadeIn();
			if (callback) {
				callback();
			}
		});
	},
	hide: function () {
		$('.alter_box').animate({ 'opacity': '0' }, 200);
		setTimeout(function () {
			$('.alter').remove();
		}, 200);
	}
}

// 轻提示 toast
var Toast = {
	show: function (text) {
		var toastDocument = document.createElement('div');
		toastDocument.setAttribute('class', 'toast');
		var toastInnerHtml = `
			<div class="toast_box">` + text + `</div>
		`;
		$(toastDocument).html(toastInnerHtml);
		$("body").append(toastDocument);
		$(".toast").animate({ 'top': 0 }, 200);
		setTimeout(function () {
			Toast.hide();
		}, 2000);
	},
	hide: function () {
		$('.toast').animate({ 'top': '-60px' }, 200);
		setTimeout(function () {
			$('.toast').remove();
		}, 200);
	}
}

// dialog 弹出框
var AddDialog = {
	show: function (callback) {
		var addDialogDocument = document.createElement('div');
		addDialogDocument.setAttribute('class', 'dialog');
		var addDialogInnerHtml = `
			<div class="dialog_background"></div>
			<div class="dialog_box">
				<div class="dialog_title">新增</div>
				<div class="dialog_input_box">
          <input class="public_input add_name" type="text" name="account" placeholder="请输入域名" />
        </div>
				<p class="dialog_prompt add_name_prompt"></p>
				<div class="dialog_btn_box" value="2">
          <button class="public_btn warning add_status" type="button" value="1">
            正常
          </button>
          <button class="public_btn add_status" type="button" value="2">
            未运行
          </button>
          <button class="public_btn warning add_status" type="button" value="3">
            已禁用
          </button>
        </div>
        <p class="dialog_prompt add_status_prompt"></p>
				<div id="dialog_submit" class="public_btn">
					<span class="dialog_btn_text">确认</span>
					<div class="dialog_btn_loading"></div>
				</div>
			</div>
		`;
		$(addDialogDocument).html(addDialogInnerHtml);
		$("body").append(addDialogDocument);
		$(".dialog_box").animate({ 'opacity': 1 }, 200);
		$('.dialog_background').on('click', function () {
			$('.dialog_box').animate({ 'opacity': '0' }, 200);
			setTimeout(function () {
				$('.dialog').remove();
			}, 200);
		});
		$(".add_status").on("click", function () {
			var _self = $(this);
			var _value = $(this).attr('value');
			_self.removeClass('warning');
			_self.siblings('.public_btn').addClass('warning');
			_self.parent('.dialog_btn_box').attr("value", _value);
		});
		$("#dialog_submit").on("click", function () {
			var _name = $(".add_name").val();
			var _status = $(".dialog_btn_box").attr('value');
			var _add_name_prompt = $(".add_name_prompt");
			if (!_name) {
				_add_name_prompt.text('域名不能为空');
				return;
			}
			$(".dialog_btn_text").hide()
			$(".dialog_btn_loading").fadeIn();
			var _data = {
				url: _name,
				status: _status,
			};
			if (callback) {
				callback(_data);
			};
		});
	},
	hide: function () {
		$('.dialog_box').animate({ 'opacity': '0' }, 200);
		setTimeout(function () {
			$('.dialog').remove();
		}, 200);
	}
}

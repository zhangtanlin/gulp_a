// 判定当前设备是否是 pc 端
function verifyPc() {
	if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
		var query = window.location.search;
		window.location.href =  '/pc.html' + query
	}
}
verifyPc();
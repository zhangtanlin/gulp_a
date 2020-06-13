// 判定当前设备是否是移动端
function verifyMobile() {
	if (/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
		var query = window.location.search;
		window.location.href = '/' + query
	}
}
verifyMobile();
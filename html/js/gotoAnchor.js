var anchor_last = '#startseite';

function gotoAnchor(anchor) {
	anchor_last = window.location + '';
	console.log("goto anchor " + anchor);
	window.location.replace(anchor);
	autoscroll();
}

function lastAnchor() {
	console.log("last anchor " + anchor_last);
	window.location.replace(anchor_last);
	autoscroll();
}

function autoscroll() {
	// Auto-Scroll, damit die URL-Zeile verschwindet
	setTimeout(function() {
		window.scrollTo (0,1);
	}, 0);
}
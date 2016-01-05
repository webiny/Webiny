(function (w) {
	System.import('Core/Webiny/webiny/webinyBootstrap').then(function (m) {
		w.WebinyBootstrap = new m.default();
	});
})(window);
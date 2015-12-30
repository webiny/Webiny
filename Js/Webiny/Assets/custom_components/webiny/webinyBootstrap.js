(function (w) {
	System.import('webiny/webinyBootstrap.es6').then(m => {
		w.WebinyBootstrap = new m.default();
	});
})(window);
(function (window) {

	function loadCss(filename) {
		var file = document.createElement('link');
		file.rel = 'stylesheet';
		file.type = 'text/css';
		file.href = filename;

		if (typeof file != 'undefined') {
			document.getElementsByTagName("head")[0].appendChild(file);
		}
	}

	function WebinyBootstrap() {

		var _this = this;

		this.import = function (path) {
			// TODO: add environment detection
			var parts = path.split('.');
			if (parts.length == 2 && !_.startsWith(path, './')) {
				path = '/build/dev/' + parts.join('/') + '/scripts/app.min.js';
			}
			return System.import(path);
		};

		this.run = function () {
			window._apiUrl = '/api';
			console.log("Bootstrapping WEBINY...");
			// First we need to import Core/Webiny
			_this.import('Core.Webiny').then(function () {
				_this.import('Webiny').then(function (m) {
					window.Webiny = m.default;
					Webiny.run();
				});
			});
		};


		this.includeApp = function (appName) {
			var api = new Webiny.Api.Service('/apps');

			return api.get(appName).then(function (res) {
				var assets = [];
				_.each(_.get(res.data.data.assets, 'js', []), function (item) {
					assets.push(_this.import('/build/dev/' + item));
				});
				_.each(_.get(res.data.data.assets, 'css', []), function (item) {
					loadCss('/build/dev/' + item);
				});

				return Q.all(assets).then(function () {
					var parts = appName.split('.');
					return _this.import(parts[1]);
				});
			});
		};
	}

	window.WebinyBootstrap = new WebinyBootstrap;
})(window);
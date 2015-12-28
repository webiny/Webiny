(function (window) {

	function loadAssetFile(filename, filetype) {
		var fileref = null;
		if (filetype == "js") { //if filename is a external JavaScript file
			fileref = document.createElement('script');
			fileref.setAttribute("type", "text/javascript");
			fileref.setAttribute("src", filename);
		}
		else if (filetype == "css") { //if filename is an external CSS file
			fileref = document.createElement("link");
			fileref.setAttribute("rel", "stylesheet");
			fileref.setAttribute("type", "text/css");
			fileref.setAttribute("href", filename);
		}

		if (typeof fileref != null) {
			document.getElementsByTagName("head")[0].appendChild(fileref);
		}
	}

	function WebinyBootstrap() {

		// store the old normalization function
		var systemNormalize = System.normalize;

		// override the normalization function
		System.normalize = function (name, parentName, parentAddress) {
			var parts = name.split('/');
			if (parts.length == 2 && !_.startsWith(name, './'))
				return '/build/dev/' + name + '/scripts/app.min.js';
			else
				return systemNormalize.call(this, name, parentName, parentAddress);
		};

		this.run = function () {
			window._apiPath = '/api';
			console.log("Bootstrapping WEBINY...");
			System.import('Core/Webiny').then(function () {
				System.import('Webiny').then(function (m) {
					window.Webiny = m.default;
					Webiny.run();
				});
			});
		};

		this.includeApp = function (appName) {
			return System.import(appName).then(function () {
				var parts = appName.split('/');
				return System.import(parts[1]);
			});

			/*loadAssetFile('/build/dev/' + appName + '/css/vendors.min.css', 'css');
			loadAssetFile('/build/dev/' + appName + '/css/app.min.css', 'css');

			return System.import('/build/dev/' + appName + '/scripts/vendors.min.js').then(function () {
				return System.import(appName).then(function () {
					let [webinyApp, jsApp] = appName.split('/');
					return System.import(webinyApp);
				});
			});*/
		};
	}

	window.WebinyBootstrap = new WebinyBootstrap;
})(window);
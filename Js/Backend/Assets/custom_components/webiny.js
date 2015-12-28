(function(window){
	function WebinyBootstrap() {

		// store the old normalization function
		var systemNormalize = System.normalize;

		// override the normalization function
		System.normalize = function (name, parentName, parentAddress) {
			if (name.split('/').length == 2 && !_.startsWith(name, './'))
				return '/build/dev/' + name + '/scripts/app.min.js';
			else
				return systemNormalize.call(this, name, parentName, parentAddress);
		};

		this.setApiPath = function (path) {
			window._apiPath = path;
			return this;
		};

		this.run = function () {
			console.log("RUNNING WEBINY!!");
			/*System.import('Core/Webiny').then(function () {
			 System.import('Core/Backend').then(function () {

			 });
			 });*/
		}
	}

	window.WebinyBootstrap = new WebinyBootstrap;
})(window);
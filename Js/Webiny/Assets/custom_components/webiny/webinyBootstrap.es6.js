// Find Webiny app or components and run them
function runWebiny(meta) {
	// Run app
	let appElement = document.querySelector('webiny-app');
	if (appElement) {
		let appName = appElement.attributes.name.nodeValue;
		let baseUrl = appElement.attributes['base-url'].nodeValue;
		Webiny.Router.setBaseUrl(baseUrl);
		WebinyBootstrap.includeApp(appName).then(app => {
			app.addModules(meta[appName].modules);
			_.set(window.Webiny.Apps, appName, app);
			app.run(appElement);
		});
	}

	// Mount components
	let componentElements = document.querySelectorAll('webiny-component');
	if (componentElements) {
		_.each(componentElements, el => {
			let props = {};
			_.each(el.attributes, attr => {
				props[attr.nodeName] = attr.nodeValue;
			});

			let component = _.get(window, props.name);
			if (component) {
				let element = React.createElement(component, props, el.innerHTML);
				ReactDOM.render(element, el);
			} else {
				el.remove();
			}
		});
	}
}

class WebinyBootstrapClass {

	constructor() {
		this.meta = {};
	}

	import(path) {
		let parts = path.split('.');
		if (parts.length == 2 && !_.startsWith(path, './')) {
			path = '/build/' + this.env + '/' + parts.join('/') + '/scripts/app.min.js';
		}
		return System.import(path);
	}

	run(env = 'development') {
		this.env = env;
		window._apiUrl = '/api';
		console.log("Bootstrapping WEBINY...");
		// First we need to import Core/Webiny
		this.includeApp('Core.Webiny').then(app => {
			app.addModules(this.meta['Core.Webiny'].modules).run();
			runWebiny(this.meta);
		});
	}


	includeApp(appName) {
		return axios({url: _apiUrl + '/apps/' + appName}).then(res => {
			let meta = this.meta[appName] = res.data.data;
			let assets = [];
			_.each(_.get(meta.assets, 'js', []), item => {
				if(appName == 'Core.Webiny' && _.endsWith(item, 'vendors.min.js')){
					return;
				}

				assets.push(this.import('/build/' + this.env + '/' + item));
			});
			_.each(_.get(meta.assets, 'css', []), item => {
				this.includeCss('/build/' + this.env + '/' + item);
			});

			return Q.all(assets).then(() => {
				let parts = appName.split('.');
				return this.import(parts[1]).then(m => m.default);
			});
		});
	}

	includeCss(filename) {
		let file = document.createElement('link');
		file.rel = 'stylesheet';
		file.type = 'text/css';
		file.href = filename;

		if (typeof file != 'undefined') {
			document.getElementsByTagName("head")[0].appendChild(file);
		}
	}
}

export default WebinyBootstrapClass;
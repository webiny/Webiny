import Rad from './../Rad/App';

Rad.run = function () {
	console.log("Running Webiny!!! :)");
	// Run app
	let appElement = document.querySelector('rad-app');
	if (appElement) {
		let appName = appElement.attributes.name.nodeValue;
		let baseUrl = appElement.attributes['base-url'].nodeValue;
		Rad.Router.setBaseUrl(baseUrl);
		System.import(appName).then(app => {
			window.Webiny.Apps[appName] = app.default;
			window.Webiny.Apps[appName].run(appElement);
		});
	}

	// Mount components
	let componentElements = document.querySelectorAll('rad-component');
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
};

export default Rad;
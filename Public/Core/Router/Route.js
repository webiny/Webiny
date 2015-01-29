class Route {
	/**
	 * @param state This is passed from History.getState()
	 */
	constructor(pattern) {
		this.pattern = pattern;
		this.regex = null;
		this.paramNames = [];
		this.paramValues = {};
		this.namedParam = /:\w+/g;
		this.splatParam = /\*\w+/g;

		// Extract params names
		var params = pattern.match(this.namedParam);
		if (params) {
			params.forEach((item, i) => {
				this.paramNames.push(item.replace(':', ''));
			});
		}

		// Build route regex
		var regex = pattern.replace(this.namedParam, '([^\/]+)').replace(this.splatParam, '(.*?)');
		this.regex = new RegExp("^" + regex + "$");
	}

	match(url) {
		if (!this.regex.test(url)) {
			return false;
		}

		// Url params
		if (this.paramNames) {
			var matchedParams = url.match(this.regex);
			if (matchedParams) {
				matchedParams.shift();
				matchedParams.forEach((value, index) => {
					this.paramValues[this.paramNames[index]] = value;
				});
			}
		}

		// Parse query string params
		window.location.search.substring(1).split('&').forEach(el => {
			if(el != '') {
				el = el.split('=');
				this.paramValues[decodeURIComponent(el[0])] = decodeURIComponent(el[1]);
			}
		});
		return true;
	}

	getHref(params = {}) {
		var url = this.pattern;
		var newParams = Object.assign(this.paramValues, params);

		// Build main URL
		this.paramNames.forEach(param => {
			url = url.replace(':' + param, newParams[param]);
			delete newParams[param];
		});

		// Build query string from the remaining params
		if(Object.keys(newParams).length > 0){
			url += '?'+jQuery.param(newParams);
		}

		return url;
	}

	getPattern() {
		return this.pattern;
	}

	getParams(name = null) {
		if (name) {
			return this.paramValues[name] || null;
		}
		return this.paramValues;
	}
}

export default Route;
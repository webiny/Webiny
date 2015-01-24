class Route {
	/**
	 * @param state This is passed from History.getState()
	 */
	constructor(pattern) {
		this.pattern = pattern;
		this.regex = null;
		this.paramNames = {};
		this.paramValues = {};
		this.namedParam = /:\w+/g;
		this.splatParam = /\*\w+/g;

		// Extract params names
		var params = pattern.match(this.namedParam);
		if (params) {
			params.forEach((item, i) => {
				this.paramNames[i] = item.replace(':', '');
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

		if (this.paramNames) {
			var matchedParams = url.match(this.regex);
			if (matchedParams) {
				matchedParams.shift();
				matchedParams.forEach((value, index) => {
					this.paramValues[this.paramNames[index]] = value;
				});
			}
		}
		return true;
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
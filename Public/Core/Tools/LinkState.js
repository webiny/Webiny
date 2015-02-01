class LinkState {

	constructor(component, key) {
		this.component = component;
		this.key = key;
	}

	create() {
		return {
			value: this.__getValue(this.key),
			requestChange: this.__createStateKeySetter()
		}
	}

	__getValue(key) {
		var value = this.component.state;
		if (Object.keys(value).length == 0) {
			return null;
		}
		key.split('.').forEach(key => {
			if (value.hasOwnProperty(key)) {
				value = value[key];
			}
		});
		return value;
	}

	__createStateKeySetter() {
		var component = this.component;
		var key = this.key;

		// Partial state is allocated outside of the function closure so it can be
		// reused with every call, avoiding memory allocation when this function
		// is called.
		var partialState = {};
		var _this = this;
		return function stateKeySetter(value, callback) {
			if (typeof value == 'undefined') {
				value = '';
			}
			var oldValue = _this.__getValue(key);
			_this.__buildPartialState(partialState, value);
			component.setState(partialState);

			// Execute callback if defined
			var keyFnName = _this.key.split('.').map((key) => {
				return key.charAt(0).toUpperCase() + key.slice(1);
			}).join('');

			if (callback && component.hasOwnProperty(callback)) {
				component[callback](value, oldValue);
			} else if (component.hasOwnProperty('onChange' + keyFnName)) {
				component['onChange' + keyFnName].call(component, value, oldValue);
			}
		};
	}

	__buildPartialState(obj, value) {
		var keyPath = this.key.split('.');
		var i = 0;
		var len = keyPath.length - 1;

		for (; i < len; i++) {
			if (!obj.hasOwnProperty(keyPath[i])) {
				obj[keyPath[i]] = {};
			}
			obj = obj[keyPath[i]];
		}

		obj[keyPath[i]] = value;
	}

}

export default LinkState;
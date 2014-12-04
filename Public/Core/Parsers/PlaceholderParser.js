class PlaceholderParser {

	parse(tpl) {

		/**
		 * Replace self-closing tag with full tag, because after conversion to DOM, it will be a full tag
		 */
		tpl = tpl.replace(/(<w-placeholder name="\w+")\/>/g, '$1></w-placeholder>');

		/**
		 * Store original TPL for later replacement
		 */
		var original = tpl;
		tpl = '<div id="w-virtual-dom">' + tpl + '</div>';
		var div = document.createElement('div');
		div.innerHTML = tpl;
		
		/**
		 * 1. Wrap TPL into new div#w-virtual-dom
		 * 2. Extract w-placeholder elements
		 */

		var elements = div.querySelectorAll("w-placeholder");

		/**
		 * Parse placeholder template
		 */
		if (elements.length > 0) {
			this._objectToArray(elements).forEach((element) => {

				// Get attributes
				var attrs = {};
				this._objectToArray(element.attributes).forEach((attr) => {
					attrs[attr.nodeName] = attr.value;
				});

				// Create ReactJs
				var reactJs = this._createReactJs(attrs);
				original = original.replace(element.outerHTML, reactJs);
			});
		}
		return original;
	}

	_createReactJs(attrs) {
		return '{function(){\
				return ComponentLoader.getInstance().getComponents("' + attrs.name + '");\
			}.bind(this)()}';
	}

	_objectToArray(obj) {
		return [].map.call(obj, function (element) {
			return element;
		})
	}
}

export default PlaceholderParser;
class IfParser {

	parse(tpl) {
		/**
		 * 1. Wrap TPL into new div#w-virtual-dom
		 * 2. Extract w-if elements
		 */

		tpl = '<div id="w-virtual-dom">' + tpl.replace(/<w-else>/g, '<w-else></w-else>') + '</div>';
		var div = document.createElement('div');
		div.innerHTML = tpl;

		// Parse if template
		var elements = div.querySelectorAll("div#w-virtual-dom > w-if");
		if (elements.length > 0) {
			elements.forEach((element) => {
				// Get 'if' attributes
				var attrs = {};
				element.attributes.forEach((attr) => {
					attrs[attr.nodeName] = attr.nodeValue;
				});

				// Conditional templates
				var templates = element.innerHTML.split('<w-else></w-else>');

				// Create ReactJs
				var reactJs = this._createReactJs(attrs, templates);
			});

			tpl = tpl.replace(match[0], this.reactJs);
		}

		return tpl;
	}

	_createReactJs(attrs, templates) {
		return "function(){\
			var condition = \'\';\
			if(item.name != \'Pavel\'){\
				condition = item.name\
			} else {\
				condition = <strong>{item.name} ({item.comments.length})</strong>\
			}\
			return <div>{condition}</div>;\
		}.bind(this)()";
	}
}

export default IfParser;
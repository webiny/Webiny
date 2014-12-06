import BaseParser from '/Core/Base/BaseParser';

class IfParser extends BaseParser {

	parse(tpl) {
		tpl = tpl.replace(/<w-else>/g, '<w-else></w-else>').replace(/<\/w-else><\/w-else>/g, '</w-else>');
		var div = document.createElement('div');
		div.innerHTML = tpl;

		// First we need to determine the element that holds some <w-if> tags
		var firstIf = div.querySelector("w-if");
		if (!firstIf) {
			return tpl;
		}

		// Now we can select its child <w-if> elements
		var ifContainer = document.createElement('div');
		ifContainer.innerHTML = firstIf.parentNode.innerHTML;
		div.innerHTML = ifContainer.outerHTML;

		// Extract first level <w-if> tags
		var elements = div.querySelectorAll('div > w-if');

		if (elements.length > 0) {
			this._objectToArray(elements).forEach((element) => {
				// Get 'if' attributes
				var attrs = {};
				this._objectToArray(element.attributes).forEach((attr) => {
					attrs[attr.nodeName] = attr.value;
				});

				// Check if current w-if element has nested w-if elements
				var originalHTML = element.outerHTML;
				if (element.innerHTML.indexOf('w-if') > -1) {
					// First we need to determine the element that holds some <w-if> tags
					var nestedIfs = this._wrapForQuery(element).querySelectorAll("w-if");
					this._objectToArray(nestedIfs).forEach((nIf) => {
						var parser = new IfParser();
						var nIfHtml = parser.parse(nIf.outerHTML);
						element.innerHTML = element.innerHTML.replace(nIf.outerHTML, parser.parse(nIfHtml));
					});
				}
				
				// Conditional templates
				var templates = element.innerHTML.split('<w-else></w-else>');
				templates[1] = typeof templates[1] != 'undefined' ? templates[1] : false;
				
				// Create ReactJs
				var reactJs = this._createReactJs(attrs, templates);

				tpl = tpl.replace(originalHTML, reactJs);
			});
		}

		return tpl;
	}

	_createReactJs(attrs, templates) {
		var ifTpl = "if(" + attrs.cond + "){return <div>" + templates[0].trim() + "</div>}";

		if (templates[1]) {
			ifTpl += " else { return <div>" + templates[1].trim() + "</div>;}";
		}

		return "{function(){" + ifTpl + "}.bind(this)()}";
	}

	_parseTemplate(html) {
		var ifParser = new IfParser();
		return ifParser.parse(html);
	}

}

export default IfParser;
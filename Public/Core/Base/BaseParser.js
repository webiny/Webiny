class BaseParser{
	_objectToArray(obj) {
		return [].map.call(obj, function (element) {
			return element;
		})
	}

	_wrapForQuery(html, outerWrapper = false){
		if(typeof html != 'string'){
			html = outerWrapper ? html.outerHTML : html.innerHTML;
		}

		var outerDiv = document.createElement('div');
		var innerDiv = document.createElement('div');

		innerDiv.innerHTML = html;
		outerDiv.innerHTML = innerDiv.outerHTML;
		return outerDiv;
	}
}

export default BaseParser;
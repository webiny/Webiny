class LoopParser {

	parse(tpl) {
		// 0 = contains the entire loop HTML
		// 1 = contains the opening tag of the w-loop with it's attributes
		// 2 = contains loop template

		var loopRegex = /(<w-loop.+?[^>]>)([\S\s.*]*)<\/w-loop>/;

		// Parse loop template
		var match = loopRegex.exec(tpl);
		if (match) {
			this.attrs = this._parseAttributes(match[1]);
			this.itemTpl = this._parseItemTemplate(match[2]);
			this.reactJs = this._createReactJs();

			tpl = tpl.replace(match[0], this.reactJs);
		}

		return tpl;
	}

	_injectKey(item) {
		// Inject 'key' attribute
		var firstTagRegex = /(<[\w-]+[^\s>])/;
		return item.trim().replace(firstTagRegex, '$1 key={' + this.attrs.index + '}');
	}

	_createReactJs() {
		var lDelim = '{';
		var rDelim = '}';
		return "\n" + lDelim + this.attrs.items + '.map(function(' + this.attrs.item + ', ' + this.attrs.index + '){return ' + this.itemTpl + '})' + rDelim;
	}

	_parseAttributes(tag) {
		var attrs = {
			items: 'this.state.items',
			item: 'item',
			index: 'index'
		};

		// Parse tag to extract attributes
		var items = /items={([\w._$]+)}/.exec(tag)[1];
		if (items) {
			attrs.items = items;
		}

		var item = /as="?([\w_$]+)"?/.exec(tag)[1];
		if (item) {
			attrs.item = item;
		}

		var index = /index="?([\w_$]+)"?/.exec(tag)[1];
		if (index) {
			attrs.index = index;
		}

		return attrs;
	}

	_parseItemTemplate(html) {
		if (html.indexOf('w-loop') > -1) {
			var lp = new LoopParser();
			html = lp.parse(html);
		}
		return this._injectKey(html);
	}
}

export default LoopParser;
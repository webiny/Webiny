import Parsers from '/Core/Parsers/Parsers';

class TemplateParser {

	static parse(template) {
		var parsers = Parsers;
		Object.keys(parsers).forEach(function (key) {
			if (template.indexOf(key) > -1) {
				var parser = new parsers[key];
				template = parser.parse(template);
			}
		});
		return template;
	}
}

export default TemplateParser;
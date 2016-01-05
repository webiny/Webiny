(function () {

    var mixIns = {};

	/**
	 * *************************** Array ***************************
	 */

	/**
	 * Uses already existing _.contains method, added just to make code more readable in certain cases
	 * @returns {*}     Collection with renamed keys
	 */
	mixIns.in = function (value, array) {
		return _.contains(array, value);
	};


	/**
     * *************************** Collection ***************************
     */

    /**
     * Loops over collection of objects and renames given key
     * @param collection
     * @param fromKey   A key to rename
     * @param toKey     New key name
     * @returns {*}     Collection with renamed keys
     */
    mixIns.renameKeys = function (collection, fromKey, toKey) {
        if (_.isArray(collection)) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i][fromKey]) {
                    collection[i][toKey] = collection[i][fromKey];
                    delete collection[i][fromKey];
                }
            }
            return collection;
        }
    };


    /**
     * *************************** Lang ***************************
     */

    /**
     * This is the opposite of _.isUndefined.
     * @returns {*}
     */
    mixIns.isDefined = function (variable) {
        return !_.isUndefined(variable);
    };


	/**
	 * *************************** Object ***************************
	 */

	/**
	 * Returns an ID from given variable - if string was passed, it assumes that's it, otherwise it returns 'id' field from given object
	 * @returns {*}
	 */
	mixIns.id = function (variable) {
		return _.isString(variable) ? variable : _.get(variable, 'id', null);
	};

    /**
     * *************************** String ***************************
     */

    /**
     * Connects all arguments with given string
     * You can pass any number of arguments, the last argument is the connecting string
	 * Last argument can be string or object:
	 * - if string, then this will be the main connector for all parts
	 * - if object, options can be passed separately
     * @returns {string}
     */
    mixIns.connect = function () {

		var connector = {main: '', last: '', strict: false};

		if (_.isObject(_.last(arguments))) {
			_.assign(connector, _.last(arguments));
		} else {
			connector.main = _.last(arguments);
		}

		if (!connector.last) {
			connector.last = connector.main;
		}

		// Make a final list of all parts
		var list = [];
		for (var i = 0; i <= arguments.length - 2; i++) {
			var currentArg = arguments[i];
			if (_.isArray(currentArg)) {
				list = list.concat(currentArg)
			} else {
				list.push(currentArg)
			}
		}

		var output = '';
		for (i = 0; i <= list.length - 1; i++) {

			if (!list[i] && !connector.strict) {
				continue;
			}

			var currentPart = list[i];
			var isLast = i == (list.length - 1);

			if (output == '') {
				output += currentPart;
				continue;
			}
			output += isLast ? connector.last + currentPart : connector.main + currentPart;
		}
		return output;
	};

    /**
     * Connects given arguments with a dash ("-")
     * @returns {string}
     */
    mixIns.dashed = function () {
        var args = argumentsToArray(arguments);
        args.push('-');
        return mixIns.connect.apply(null, args);
    };

    /**
     * Connects given arguments with a dot (".")
     * @returns {string}
     */
    mixIns.dotted = function () {
        var args = argumentsToArray(arguments);
        args.push('.');
        return mixIns.connect.apply(null, args);
    };

    /**
     * Makes a plural form of given word if needed
     * First parameter is word, and second is total count
     * For convenience, this can also prepend given count in the final output
     * @param word
     * @param count
     * @param prependCount
     * @returns {*}
     */
    mixIns.pluralize = function (word, count, prependCount) {
        if (count > 1 || count == 0) {
            word = pluralization(word);
        }
        return prependCount ? count + ' ' + word : word;
    };

    /**
     * Connects given arguments with a forward slash ("/")
     * @returns {string}
     */
    mixIns.slashed = function () {
        var args = argumentsToArray(arguments);
        args.push('/');
        return mixIns.connect.apply(null, args);
    };

    /**
     * Connects given arguments with a blank space (" ")
     * @returns {string}
     */
    mixIns.spaced = function () {
        var args = argumentsToArray(arguments);
        args.push(' ');
        return mixIns.connect.apply(null, args);
    };


	/**
	 * Connects given arguments with a comma and last with an 'and' word - useful when outputting lists in user interface
	 * @returns {string}
	 */
	mixIns.listed = function () {
		var args = argumentsToArray(arguments);
		args.push({main:', ', last: ' and '});
		return mixIns.connect.apply(null, args);
	};

	/**
     * Transforms given string to slug
     * @returns {*}
     */
    mixIns.toSlug = function (string) {
        var trimmed = _.trim(string);
        var url = trimmed.replace(/[^a-z0-9-\/]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        if (url.length) {
            return url.replace(/\/{2,}/g, '/');
        }
        return null;
    };

    /**
     * Just a wrapper of original toString
     * @returns {*}
     */
    mixIns.toUpperCase = function (string) {
        return string.toUpperCase ? string.toUpperCase() : '';
    };

    /**
     * Returns first N words from given sentence
     * Optionally, you can append an additional ending to the output ('...' by default)
     * @returns {*}
     */
    mixIns.words = function (sentence, count, ending) {
        ending = ending || '...';
        var parts = sentence.split(/\s+/);
        var totalCount = parts.length;
        parts = parts.slice(0, count);
        return totalCount > count ? parts.slice(0, count).join(' ') + ending : parts.join(" ");
    };

    _.mixin(mixIns);

})();

var argumentsToArray = function (args) {
    return [].slice.call(args, 0);
};

var pluralization = function (originalWord, revert) {

    var plural = {
        '(quiz)$': "$1zes",
        '^(ox)$': "$1en",
        '([m|l])ouse$': "$1ice",
        '(matr|vert|ind)ix|ex$': "$1ices",
        '(x|ch|ss|sh)$': "$1es",
        '([^aeiouy]|qu)y$': "$1ies",
        '(hive)$': "$1s",
        '(?:([^f])fe|([lr])f)$': "$1$2ves",
        '(shea|lea|loa|thie)f$': "$1ves",
        'sis$': "ses",
        '([ti])um$': "$1a",
        '(tomat|potat|ech|her|vet)o$': "$1oes",
        '(bu)s$': "$1ses",
        '(alias)$': "$1es",
        '(octop)us$': "$1i",
        '(ax|test)is$': "$1es",
        '(us)$': "$1es",
        's$': "s"
    };

    var singular = {
        '(quiz)zes$': "$1",
        '(matr)ices$': "$1ix",
        '(vert|ind)ices$': "$1ex",
        '^(ox)en$': "$1",
        '(alias)es$': "$1",
        '(octop|vir)i$': "$1us",
        '(cris|ax|test)es$': "$1is",
        '(shoe)s$': "$1",
        '(o)es$': "$1",
        '(bus)es$': "$1",
        '([m|l])ice$': "$1ouse",
        '(x|ch|ss|sh)es$': "$1",
        '(m)ovies$': "$1ovie",
        '(s)eries$': "$1eries",
        '([^aeiouy]|qu)ies$': "$1y",
        '([lr])ves$': "$1f",
        '(tive)s$': "$1",
        '(hive)s$': "$1",
        '(li|wi|kni)ves$': "$1fe",
        '(shea|loa|lea|thie)ves$': "$1f",
        '(^analy)ses$': "$1sis",
        '((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$': "$1$2sis",
        '([ti])a$': "$1um",
        '(n)ews$': "$1ews",
        '(h|bl)ouses$': "$1ouse",
        '(corpse)s$': "$1",
        '(us)es$': "$1",
        's$': ""
    };

    var irregular = {
        'move': 'moves',
        'foot': 'feet',
        'goose': 'geese',
        'sex': 'sexes',
        'child': 'children',
        'man': 'men',
        'tooth': 'teeth',
        'person': 'people'
    };

    var uncountable = [
        'sheep',
        'fish',
        'deer',
        'series',
        'species',
        'money',
        'rice',
        'information',
        'equipment'
    ];

    // save some time in the case that singular and plural are the same
    if (uncountable.indexOf(originalWord.toLowerCase()) >= 0)
        return originalWord;

    // check for irregular forms
    for (var word in irregular) {

        if (revert) {
            var pattern = new RegExp(irregular[word] + '$', 'i');
            var replace = word;
        } else {
            var pattern = new RegExp(word + '$', 'i');
            var replace = irregular[word];
        }
        if (pattern.test(originalWord))
            return originalWord.replace(pattern, replace);
    }

    if (revert) var array = singular;
    else  var array = plural;

    // check for matches using regular expressions
    for (var reg in array) {

        var pattern = new RegExp(reg, 'i');

        if (pattern.test(originalWord))
            return originalWord.replace(pattern, array[reg]);
    }

    return originalWord + 's';
};
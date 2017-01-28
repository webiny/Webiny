import Webiny from 'Webiny';

let translations = {};

/**
 * This is responsible for replacing given text with given values
 * It will automatically detect if it needs to return a string or JSX based on given variables
 * (if all variables are strings, then final output will also be returned as string)
 * @param text
 * @param values
 * @returns {*}
 */
function replaceVariables(text, values) {
    if (_.isEmpty(values)) {
        return text;
    }

    // Let's first check if we need to return pure string or JSX
    let stringOutput = true;
    _.each(values, (value) => {
        if (!_.isString(value)) {
            stringOutput = false;
        }
    });

    const parts = text.split(/(\{.*?\})/);

    if (stringOutput) {
        let output = '';
        parts.forEach(part => {
            output += _.startsWith(part, '{') ? values[_.trim(part, '{}')] : part;
        });
        return output;
    }

    // Let's create a JSX output
    return parts.map((part, index) => {
        if (_.startsWith(part, '{')) {
            return <webiny-i18n-part key={index}>{values[_.trim(part, '{}')]}</webiny-i18n-part>;
        }
        return <webiny-i18n-part key={index}>{part}</webiny-i18n-part>;
    });
}

const i18n = function i18n(key, text, variables) {
    let output = i18n.getTranslation(key) || text;
    output = replaceVariables(output, variables);
    i18n.parsers.forEach(parser => {
        output = parser(output, key, text, variables);
    });
    return output;
};

i18n.language = '';
i18n.api = null;
i18n.cacheKey = null;
i18n.parsers = [];

/**
 * Used for rendering text in DOM
 * @param key
 * @param label
 * @param variables
 * @param options
 * @returns {XML}
 */
i18n.render = function render(key, label, variables, options) {
    return <Webiny.Ui.Components.I18N placeholder={label} translationKey={key} variables={variables} options={options}/>;
};

// Following methods are plain-simple for now - let's make them smarter in the near future
i18n.price = function price(value, currency = '£') {
    const currencySymbols = {gbp: '£', usd: '$', eur: '€'}; // Plain simple for now
    return accounting.formatMoney(value, _.get(currencySymbols, currency, currency));
};

i18n.number = function price(value, decimals = 0) {
    return accounting.formatNumber(value, decimals);
};

i18n.date = function date(value, format = 'DD/MMM/YY') {
    return moment(value).format(format);
};

i18n.time = function time(value, format = 'HH:mm') {
    return moment(value).format(format);
};

i18n.datetime = function datetime(value, format = 'DD/MMM/YY HH:mm') {
    return moment(value).format(format);
};

i18n.getTranslation = function getTranslation(key) {
    return translations[key] || '';
};

i18n.setTranslation = function setTranslation(key, translation) {
    translations[key] = translation;
    return this;
};

i18n.getTranslations = function getTranslations() {
    return translations;
};

i18n.hasTranslation = function hasTranslation(key) {
    return _.get(translations, key);
};

i18n.setApiEndpoint = function setApiEndpoint(api) {
    this.api = api;
    return this;
};

i18n.getLanguage = function getLanguage() {
    return this.language;
};

i18n.addParser = function addParser(callback) {
    this.parsers.push(callback);
    return this;
};

i18n.removeParsers = function removeParsers() {
    this.parsers = [];
    return this;
};

i18n.setCacheKey = function setCacheKey(cacheKey) {
    this.cacheKey = cacheKey;
    return this;
};

i18n.initialize = function setLanguage(language) {
    this.language = language;
    // TODO: Set moment / accounting language settings here

    // If we have the same cache key, that means we have latest translations - we can safely read from local storage.
    if (this.cacheKey === parseInt(localStorage[`Webiny.i18n.cacheKey`])) {
        translations = JSON.parse(localStorage[`Webiny.i18n.translations`]);
        return Promise.resolve();
    }

    // If we have a different cache key (or no cache key at all), we must fetch translations from server
    return this.api.setQuery({language: this.language}).execute().then(apiResponse => {
        localStorage[`Webiny.i18n.language`] = this.language;
        localStorage[`Webiny.i18n.cacheKey`] = apiResponse.getData('cacheKey', null);
        localStorage[`Webiny.i18n.translations`] = JSON.stringify(apiResponse.getData('translations'));
        translations = _.assign(translations, apiResponse.getData('translations'));
        return apiResponse;
    });
};

export default i18n;
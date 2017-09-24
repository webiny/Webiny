import _ from 'lodash';
import md5 from 'blueimp-md5';
import Webiny from 'webiny';
import React from 'react';
import I18nComponent from './I18N';
import BuiltInModifiers from './BuiltInModifiers';

class I18n {
    constructor() {
        this.locales = {current: null, list: []};
        this.groups = {list: []};
        this.cacheKey = null;
        this.modifiers = BuiltInModifiers;
        this.translations = {};
        this.component = I18nComponent;

        const translate = (base, variables = {}, options = {}) => {
            if (_.isString(base) && _.isString(variables)) {
                const key = base + '.' + md5(variables);
                return translate(variables, options, key);
            }

            const key = options.namespace + '.' + md5(base);
            return this.translate(base, variables, key);
        };

        Object.getOwnPropertyNames(I18n.prototype).map(method => {
            if (method !== 'constructor') {
                translate[method] = this[method].bind(this);
            }
        });

        return translate;
    }

    /**
     * Initializes i18n with given locale and current locale cache key.
     * @returns {*}
     */
    async initialize() {
        const i18nCache = await Webiny.IndexedDB.get('Webiny.I18n');

        // If we have the same cache key, that means we have latest translations - we can safely read from local storage.
        if (i18nCache && i18nCache.cacheKey === this.getCacheKey()) {
            return this.setTranslations(i18nCache.translations);
        }

        // If we have a different cache key (or no cache key at all), we must fetch translations from server
        const api = new Webiny.Api.Endpoint('/entities/webiny/i18n-texts');
        const response = await api.get('translations/locales/' + this.getLocale());
        await Webiny.IndexedDB.set('Webiny.I18n', response.getData());
        this.setTranslations(response.getData('translations'));
        return response;
    }

    translate(base, variables = {}, textKey) {
        let output = this.getTranslation(textKey) || base;
        return this.replaceVariables(output, variables);
    }

    setComponent(component) {
        this.component = component;
    }

    getTranslation(key) {
        return this.translations[key] || '';
    }

    setTranslation(key, translation) {
        this.translations[key] = translation;
        return this;
    }

    /**
     * Returns all fetched translations.
     * @returns {*|{}}
     */
    getTranslations() {
        return this.translations;
    }

    /**
     * Returns all fetched translations.
     * @returns {*|{}}
     */
    setTranslations(translations) {
        this.translations = translations;
        return this;
    }

    /**
     * Returns true if given key has a translation for currently selected locale.
     * @param key
     */
    hasTranslation(key) {
        return _.get(this.translations, key);
    }

    /**
     * Returns a list of all available text groups.
     */
    async getTextGroups(query = {_fields: 'id,app,name,description'}) {
        const response = await new Webiny.Api.Endpoint('/entities/webiny/i18n-text-groups').get(null, query);
        this.locales.list = response.getData('list');
        return this.locales.list;
    }

    /**
     * Returns currently selected locale.
     * @returns {string|string|*}
     */
    getLocale() {
        return this.locales.current;
    }

    /**
     * Returns a list of all available locales.
     */
    async getLocales(query = {_fields: 'id,key,label,enabled'}) {
        const response = await new Webiny.Api.Endpoint('/entities/webiny/i18n-locales').get(null, query);
        this.locales.list = response.getData('list');
        return this.locales.list;
    }

    /**
     * @returns {string|string|*}
     */
    setLocale(locale) {
        this.locales.current = locale;
        return this;
    }

    setCacheKey(cacheKey) {
        this.cacheKey = cacheKey;
        return this;
    }

    getCacheKey(cacheKey) {
        return this.cacheKey;
    }

    /**
     * Internal methods below.
     * @param text
     */
    getTextParts(text) {
        return text.split(/(\{.*?\})/);
    }

    processTextPart(part, values) {
        // If not a variable, but an ordinary text, just return it, we don't need to do any extra processing with it.
        if (!_.startsWith(part, '{')) {
            return part;
        }

        part = _.trim(part, '{}');
        part = part.split('|');

        let [variable, modifier] = part;

        // Check if we have received {value: ..., format: ...} object.
        const output = {value: values[variable], format: null};

        // If variable value is an object, the it must have 'value' key set.
        // We must also be sure we are not dealing with React component.
        if (_.isPlainObject(output.value) && !React.isValidElement(output.value)) {
            if (!_.has(output.value, 'value')) {
                throw Error(`Key "value" is missing for variable {${variable}}.`);
            }

            // Before assigning real value, let's check if we have a custom formatter set.
            if (_.isFunction(output.value.format)) {
                output.format = output.value.format;
            }

            output.value = output.value.value;
        }

        if (modifier) {
            let parameters = modifier.split(':');
            let name = parameters.shift();
            if (this.modifiers[name]) {
                output.value = this.modifiers[name]('' + output.value, parameters);
            }
        }

        if (output.format) {
            return output.format(output.value);
        }

        return output.value;
    }

    /**
     * This is responsible for replacing given text with given values
     * It will automatically detect if it needs to return a string or JSX based on given variables
     * (if all variables are strings, then final output will also be returned as string)
     * @param text
     * @param values
     * @returns {*}
     */
    replaceVariables(text, values) {
        if (_.isEmpty(values)) {
            return text;
        }

        // Let's first check if we need to return pure string or JSX
        let stringOutput = true;
        _.each(values, value => {
            if (!_.isString(value) && !_.isNumber(value)) {
                stringOutput = false;
                return false;
            }
        });

        const parts = this.getTextParts(text);

        if (stringOutput) {
            return parts.reduce((carry, part) => carry + this.processTextPart(part, values), '');
        }

        // Let's create a JSX output
        return parts.map((part, index) => <webiny-i18n-part key={index}>{this.processTextPart(part, values)}</webiny-i18n-part>);
    }

    /**
     * Registers single modifier.
     * @param name
     * @param callback
     * @returns {I18n}
     */
    registerModifier(name, callback) {
        this.modifiers[name] = callback;
        return this;
    }

    /**
     * Registers all modifiers in given array.
     * @param modifiers
     * @returns {I18n}
     */
    registerModifiers(modifiers) {
        modifiers.forEach((callback, name) => this.registerModifier(name, callback));
        return this;
    }

    /**
     * Unregisters given modifier.
     * @param name
     * @returns {I18n}
     */
    unregisterModifier(name) {
        delete this.modifiers[name];
        return this;
    }

    toText(element) {
        if (_.isString(element) || _.isNumber(element)) {
            return element;
        }

        if (Webiny.elementHasFlag(element, 'i18n')) {
            const props = element.props;
            return this.translate(props.base, props.variables, props.textKey);
        }

        return '';
    }

    /**
     * Used for rendering text in DOM
     * @param textKey
     * @param base
     * @param variables
     * @returns {XML}
     */
    render(textKey, base, variables) {
        return React.createElement(this.component, {textKey, base, variables});
    }

}

export default new I18n();
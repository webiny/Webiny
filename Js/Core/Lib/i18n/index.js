import _ from 'lodash';
import Webiny from 'webiny';
import React from 'react';
import I18nComponent from './I18N';
import BuiltInModifiers from './BuiltInModifiers';

class I18n {
    constructor() {
        this.locales = {current: null, list: []};
        this.groups = {list: []};
        this.api = null;
        this.cacheKey = null;
        this.modifiers = BuiltInModifiers;
        this.translations = {};
        this.component = I18nComponent;

        const translate = (base, variables = {}, key = null) => {
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
        if (_.isFunction(output.value.format)) {
            output.format = output.value.format;
            output.value = output.value.value;
        }

        if (modifier) {
            let parameters = modifier.split(':');
            let name = parameters.shift();
            if (this.modifiers[name]) {
                output.value = this.modifiers[name](output.value, parameters);
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

    translate(base, variables = {}, translationKey = null) {
        let output = this.getTranslation(translationKey) || base;
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
     * Returns true if given key has a translation for currently selected locale.
     * @param key
     */
    hasTranslation(key) {
        return _.get(this.translations, key);
    }

    /**
     * Sets the API endpoint for fetching translations.
     * @param api
     * @returns {i18n}
     */
    setApiEndpoint(api) {
        this.api = api;
        return this;
    }

    /**
     * Returns a list of all available locales.
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
        modifiers.forEach((callback, name) => this.registerModifier(name, callback))
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

    initialize(locale = 'en_GB') {
        this.setLocale(locale);
        // TODO: Set moment / accounting locale settings here

        // If we have the same cache key, that means we have latest translations - we can safely read from local storage.
        if (this.cacheKey === parseInt(Webiny.LocalStorage.get('Webiny.I18n.cacheKey'))) {
            this.translations = JSON.parse(Webiny.LocalStorage.get('Webiny.I18n.translations'));
            return Promise.resolve();
        }

        // If we have a different cache key (or no cache key at all), we must fetch translations from server
        return this.api.setQuery({key: this.locale}).execute().then(apiResponse => {
            Webiny.LocalStorage.set('Webiny.I18n.locale', this.locale);
            Webiny.LocalStorage.set('Webiny.I18n.cacheKey', apiResponse.getData('cacheKey', null));
            Webiny.LocalStorage.set('Webiny.I18n.translations', JSON.stringify(apiResponse.getData('translations')));
            this.translations = _.assign(this.translations, apiResponse.getData('translations'));
            return apiResponse;
        });
    }

    toText(element) {
        if (_.isString(element) || _.isNumber(element)) {
            return element;
        }

        if (Webiny.elementHasFlag(element, 'i18n')) {
            const props = element.props;
            return this.translate(props.base, props.variables, props.translationKey);
        }

        return '';
    }

    /**
     * Used for rendering text in DOM
     * @param translationKey
     * @param base
     * @param variables
     * @returns {XML}
     */
    render(translationKey, base, variables) {
        return React.createElement(this.component, {translationKey, base, variables});
    }

}

export default new I18n();
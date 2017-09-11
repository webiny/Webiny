import React from 'react';
import Webiny from 'webiny';
import TranslationsModal from './TextsList/TextsModal';
import ScanTexts from './TextsList/ScanTexts';
import ImportTexts from './TextsList/ImportTexts';

import _ from 'lodash';
import moment from 'moment';
import accounting from 'accounting';
import I18N from './../../I18N';

class TextsList extends Webiny.Ui.View {
    constructor() {
        super();
        this.i18n.namespace = 'Webiny.Backend.I18N.TextsList';
    }
}

TextsList.defaultProps = {
    renderer () {
        return (
            <Webiny.Ui.LazyLoad modules={['ViewSwitcher', 'View', 'Button', 'Icon', 'List', 'Input', 'Link']}>
                {Ui => (
                    <Ui.ViewSwitcher>
                        <Ui.ViewSwitcher.View view="translationsList" defaultView>
                            {showView => (
                                <Ui.View.List>
                                    <Ui.View.Header title="Translations">
                                        <Ui.Button
                                            type="primary"
                                            align="right"
                                            onClick={showView('scanTextsModal')}
                                            icon="icon-cloud-download"
                                            label="Scan"/>
                                        <Ui.Button
                                            type="primary"
                                            align="right"
                                            onClick={showView('importTextsModal')}
                                            icon="icon-cloud-download"
                                            label="Import Texts"/>
                                    </Ui.View.Header>
                                    <Ui.View.Body>
                                        <Ui.List
                                            connectToRouter
                                            title={this.i18n(`Translations`)}
                                            api="/entities/webiny/i18n-texts"
                                            searchFields="key,placeholder,app"
                                            fields="key,placeholder,app,translations"
                                            sort="-createdOn"
                                            ui="textList">
                                            <Ui.List.FormFilters>
                                                {applyFilters => (
                                                    <Ui.Input
                                                        placeholder="Search"
                                                        name="_searchQuery"
                                                        onEnter={applyFilters()}/>
                                                )}
                                            </Ui.List.FormFilters>
                                            <Ui.List.Table>
                                                <Ui.List.Table.Row>
                                                    <Ui.List.Table.Field label={this.i18n('Text')} align="left">
                                                        {row => (
                                                            <span onClick={() => showView('textModal')(row)}>
                                                                <strong>{row.key}</strong><br/>
                                                                <small>{row.placeholder}</small>
                                                            </span>
                                                        )}
                                                    </Ui.List.Table.Field>
                                                    <Ui.List.Table.Actions>
                                                        <Ui.List.Table.Action label="Edit" onClick={showView('translationModal')}/>
                                                    </Ui.List.Table.Actions>
                                                </Ui.List.Table.Row>
                                                <Ui.List.Table.Footer/>
                                            </Ui.List.Table>
                                            <Ui.List.Pagination/>
                                        </Ui.List>
                                    </Ui.View.Body>
                                </Ui.View.List>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="translationModal" modal>
                            {(showView, data) => (
                                <TranslationsModal {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="scanTextsModal" modal>
                            {(showView, data) => (
                                <ScanTexts {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                        <Ui.ViewSwitcher.View view="importTextsModal" modal>
                            {(showView, data) => (
                                <ImportTexts {...{showView, data}}/>
                            )}
                        </Ui.ViewSwitcher.View>
                    </Ui.ViewSwitcher>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

class i18n {
    constructor() {
        this.locale = '';
        this.api = null;
        this.cacheKey = null;


        /**
         * All registered modifiers. We already have built-in modifiers 'count', 'case' and 'if'.
         * @type {Array}
         */
        this.modifiers = {
            if: (value, parameters) => {
                // This is intentionally "==", because received parameters are all strings.
                return value == parameters[0] ? parameters[1] : parameters[2] || '';
            },
            gender: (value, parameters) => {
                return value === 'male' ? parameters[0] : parameters[1];
            },
            plural: (value, parameters) => {
                // Numbers can be single number or ranges.
                for (let i = 0; i < parameters.length; i = i + 2) {
                    const current = parameters[i];
                    if (current === 'default') {
                        return value + ' ' + parameters[i + 1];
                    }

                    const numbers = current.split('-');

                    // If we are dealing with a numbers range, then let's check if we are in it.
                    if (numbers.length === 2) {
                        if (value >= numbers[0] && value <= numbers[1]) {
                            return value + ' ' + parameters[i + 1];
                        }
                        continue;
                    }

                    // This is intentionally "==", because received parameters are all strings.
                    if (value == numbers[0]) {
                        return value + ' ' + parameters[i + 1];
                    }
                }

                // If we didn't match any condition, let's just remove the received value.
                return value;
            },


            // TODO: finish these one Locale settings are done.
            date: value => {
                return 'DATE: ' + value;
            },
            time: value => {
                return 'TIME: ' + value;
            },
            datetime: value => {
                return 'DATETIME: ' + value;
            }
        };

        // Initial parser for parsing modifiers is already built-in.
        this.parsers = [
            (output, key, placeholder) => {
                return output;
            }
        ];

        this.translations = {};
        this.component = I18N;

        const translate = (key, text, variables) => {
            return this.translate(key, text, variables);
        };

        Object.getOwnPropertyNames(i18n.prototype).map(method => {
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

    processTextPart(text, values) {
        // If not a variable, but an ordinary text, just return it, we don't need to do any extra processing with it.
        if (!_.startsWith(text, '{')) {
            return text;
        }

        text = _.trim(text, '{}');

        const modifiers = text.split('|');
        const variable = modifiers.shift();
        text = values[variable];

        modifiers.forEach(modifier => {
            const parameters = modifier.split(':');
            modifier = parameters.shift();
            if (this.modifiers[modifier]) {
                text = this.modifiers[modifier](text, parameters);
            }
        });
        return text;
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

    translate(key, text, variables) {
        let output = this.getTranslation(key) || text;
        output = this.replaceVariables(output, variables);
        this.parsers.forEach(parser => {
            output = parser(output, key, text, variables);
        });
        return output;
    }

    setComponent(component) {
        this.component = component;
    }

    /**
     * Used for rendering text in DOM
     * @param key
     * @param label
     * @param variables
     * @param options
     * @returns {XML}
     */
    render(key, label, variables, options) {
        return React.createElement(this.component, {placeholder: label, translationKey: key, variables, options});
    }

    // Following methods are plain-simple for now - let's make them smarter in the near future
    price(value, currency = '£', precision = 2) {
        const currencySymbols = {gbp: '£', usd: '$', eur: '€'}; // Plain simple for now
        return accounting.formatMoney(value, _.get(currencySymbols, currency, currency), precision);
    }

    number(value, decimals = 0) {
        return accounting.formatNumber(value, decimals);
    }

    date(value, format = 'DD/MMM/YY') {
        return moment(value).format(format);
    }

    time(value, format = 'HH:mm') {
        return moment(value).format(format);
    }

    datetime(value, format = 'DD/MMM/YY HH:mm') {
        return moment(value).format(format);
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
     * Returns currently set locale.
     * @returns {string|string|*}
     */
    getLocale() {
        return this.locale;
    }

    /**
     * Registers a new parser, which will be called on each translation.
     * @param callback
     * @returns {i18n}
     */
    registerParser(callback) {
        this.parsers.push(callback);
        return this;
    }

    /**
     * Un-registers all parsers.
     * @returns {i18n}
     */
    unregisterParsers() {
        this.parsers = [];
        return this;
    }

    setCacheKey(cacheKey) {
        this.cacheKey = cacheKey;
        return this;
    }

    initialize(locale = 'en_GB') {
        this.locale = locale;
        // TODO: Set moment / accounting locale settings here

        // If we have the same cache key, that means we have latest translations - we can safely read from local storage.
        if (this.cacheKey === parseInt(Webiny.LocalStorage.get('Webiny.i18n.cacheKey'))) {
            this.translations = JSON.parse(Webiny.LocalStorage.get('Webiny.i18n.translations'));
            return Promise.resolve();
        }

        // If we have a different cache key (or no cache key at all), we must fetch translations from server
        return this.api.setQuery({key: this.locale}).execute().then(apiResponse => {
            Webiny.LocalStorage.set('Webiny.i18n.locale', this.locale);
            Webiny.LocalStorage.set('Webiny.i18n.cacheKey', apiResponse.getData('cacheKey', null));
            Webiny.LocalStorage.set('Webiny.i18n.translations', JSON.stringify(apiResponse.getData('translations')));
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
            return this.translate(props.translationKey, props.placeholder, props.variables, props.options);
        }

        return '';
    }
}

window.webinyi18n = new i18n();

export default TextsList;
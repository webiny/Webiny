const translations = {
    en_GB: {
        'Selecto.Backend.Billing.InvoicesList.c7699f35c47afc1dc52a7bb914be10b3': 'Are you sure you want to approve invoice {invoiceNumber}?'
    }
};

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
    const output = _.get(translations[i18n.language], key, text);
    return replaceVariables(output, variables);
};

i18n.language = 'en_GB';

// Following methods are plain-simple for now - let's make them smarter in the near future
i18n.price = function price(value, currency = '£') {
    const currencySymbols = {gbp: '£', usd: '$', eur: '€'}; // Plain simple for now
    return accounting.formatMoney(value, _.get(currencySymbols, currency, currency));
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

export default i18n;
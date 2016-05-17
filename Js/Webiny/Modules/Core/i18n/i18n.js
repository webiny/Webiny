function replaceVariables(text, values) {
    const re = /(\{.*?\})/g;
    let m = re.exec(text);
    const variables = [];

    // Collect variables
    while (m !== null) {
        if (m.index === re.lastIndex) {
            re.lastIndex++;
        }
        variables.push(_.trim(m[0], '{}'));
        m = re.exec(text);
    }

    // Replace variables
    variables.forEach(variable => {
        text = text.replace(`{${variable}}`, values[variable]);
    });

    return text;
}

const i18n = function i18n(key, text, variables, options = {}) {
    const translations = {
        'webiny.core.statusFilter.placeholder': 'My Status'
    };

    const output = _.get(translations, key, text);
    return replaceVariables(output, variables, options);
};

// Following methods are plain-simple for now - let's make them smarter in the near future
i18n.price = function price(value, currency = '£') {
    const currencySymbols = {gbp: '£', usd: '$', eur: '€'}; // Plain simple for now
    return accounting.formatMoney(value, _.get(currencySymbols, currency, currency));
};

i18n.date = function date(value) {
    return moment(value).format('DD/MMM/YY');
};

i18n.time = function time(value) {
    return moment(value).format('HH:mm');
};

i18n.datetime = function datetime(value) {
    return moment(value).format('DD/MMM/YY HH:mm');
};

export default i18n;
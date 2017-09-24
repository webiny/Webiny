/**
 * Contains basic i18n modifiers, like plural forms, gender, numbers, price, date/time etc.
 */
export default {
    // TODO: finish these one Locale settings are done.
    date: value => {
        return 'DATE: ' + value;
    },
    time: value => {
        return 'TIME: ' + value;
    },
    datetime: value => {
        return 'DATETIME: ' + value;
    },
    price: value => {
        return 'PRICE: ' + value;
    },
    number: value => {
        return 'NUMBER: ' + value;
    }
};


// Following methods are plain-simple for now - let's make them smarter in the near future
/*
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
}*/

/**
 * Contains basic i18n modifiers, like plural forms, gender, numbers, price, date/time etc.
 */
export default {
    if: (value, parameters) => {
        return value === parameters[0] ? parameters[1] : parameters[2] || '';
    },
    gender: (value, parameters) => {
        return value === 'male' ? parameters[0] : parameters[1];
    },
    count: (value, parameters) => {
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

            if (value === numbers[0]) {
                return value + ' ' + parameters[i + 1];
            }
        }

        // If we didn't match any condition, let's just remove the received value.
        return value;
    },
    plural: (value, parameters) => {
        // Numbers can be single number or ranges.
        for (let i = 0; i < parameters.length; i = i + 2) {
            const current = parameters[i];
            if (current === 'default') {
                return parameters[i + 1];
            }

            const numbers = current.split('-');

            // If we are dealing with a numbers range, then let's check if we are in it.
            if (numbers.length === 2) {
                if (value >= numbers[0] && value <= numbers[1]) {
                    return parameters[i + 1];
                }
                continue;
            }

            if (value === numbers[0]) {
                return parameters[i + 1];
            }
        }

        return '';
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

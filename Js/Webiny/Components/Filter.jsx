class Filter {

    constructor() {
        this.filters = {};
    }

    addFilter(name, callable) {
        if (!_.has(this.filters[name])) {
            this.filters[name] = callable;
        }
        return this;
    }

    getFilter(filter) {
        return this.filters[filter];
    }

    parseFilters(filters) {
        if (!filters) {
            return {};
        }
        var splitFilters = filters.split(',');
        filters = {};
        splitFilters.forEach(v => {
            var filter = v.split(':');
            var vName = filter.shift();
            filters[vName] = filter;
        });
        return filters;
    }

    apply(value, filters) {
        _.forEach(this.parseFilters(filters), (params, filter) => {
            value = this.getFilter(filter)(value, ...params)
        });
        return value;
    }
}

var filter = new Filter();

filter.addFilter('currency', (value, currency = '£') => {
    return accounting.formatMoney(value, currency);
});

filter.addFilter('default', (value, defaultValue = '') => {
	if(value == 'undefined' || value == ''){
		value = null;
	}
    return value ? value : defaultValue;
});

filter.addFilter('date', (value, format = 'DD/MMM/YY') => {
    return moment(value).format(format);
});

filter.addFilter('time', (value, format = 'HH:mm') => {
    return moment(value).format(format);
});

filter.addFilter('datetime', (value, format = 'DD/MMM/YY HH:mm') => {
    return moment(value).format(format);
});

filter.addFilter('country', (value) => {
    return Webiny.Components.Countries[value];
});

filter.addFilter('fullAddress', value => {
    return `${value.address}, ${value.city}, ${Webiny.Components.Countries[value.country]}`;
});

filter.addFilter('number', (value, decimals = 2, separator = null) => {
    return accounting.formatNumber(value, decimals, separator)
});

filter.addFilter('truncate', (value, length = 20, char = '...') => {
	return _.trunc(value, {
		'length': length,
		'omission': char,
		'separator': ' '
	});
});

export default filter;
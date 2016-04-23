const i18n = function i18n(key, defaultValue) {
	const translations = {
		'webiny.core.statusFilter.placeholder': 'My Status'
	};
	return _.get(translations, key, defaultValue);
};

// Following methods are plain-simple for now - let's make them smarter in the near future
i18n.price = function price(value) {
	return accounting.formatMoney(value, '£');
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
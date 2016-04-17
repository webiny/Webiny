export default function i18n(key, defaultValue) {
    const translations = {
        'webiny.core.statusFilter.placeholder': 'My Status'
    };
    return _.get(translations, key, defaultValue);
};
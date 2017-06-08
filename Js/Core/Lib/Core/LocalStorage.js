import store from 'store';

/**
 * Uses store.js to handle operations with local storage (also handles cases where local storage isn't available)
 * @url https://github.com/marcuswestin/store.js/
 */
function LocalStorage() {
}

/**
 * Exposed the whole library, just in case developer needs access to it (eg. for configurations)
 */
LocalStorage.localStorage = store;

LocalStorage.set = function (key, value) {
    store.set(key, value);
    return this;
};

LocalStorage.get = function (key) {
    return store.get(key);
};

LocalStorage.remove = function (key) {
    store.remove(key);
    return this;
};

LocalStorage.clearAll = function () {
    store.clearAll();
    return this;
};

LocalStorage.each = function (callback) {
    store.each(callback);
    return this;
};

export default LocalStorage;
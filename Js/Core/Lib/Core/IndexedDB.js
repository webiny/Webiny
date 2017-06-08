import localforage from 'localforage';

/**
 * Uses localforage to handle operations with Indexed DB (also handles cases where Indexed DB isn't available)
 * @url https://github.com/localForage/localForage
 */
function IndexedDB() {
}

/**
 * Exposed the whole library, just in case developer needs access to it (eg. for configurations)
 * @type {LocalForage}
 */
IndexedDB.indexedDb = localforage;

IndexedDB.set = function (key, value) {
    return localforage.setItem(key, value);
};

IndexedDB.get = function (key) {
    return localforage.getItem(key);
};

IndexedDB.remove = function (key) {
    return localforage.removeItem(key)
};

IndexedDB.clear = function () {
    return localforage.clear();
};

export default IndexedDB;
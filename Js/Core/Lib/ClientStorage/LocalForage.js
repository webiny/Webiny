import localforage from 'localforage';

class LocalForage {
    set(key, value) {
        return localforage.setItem(key, value);
    }

    get(key) {
        return localforage.getItem(key);
    }

    remove(key) {
        return localforage.removeItem(key);
    }

    clear() {
        return localforage.clear();
    }
}

export default LocalForage;
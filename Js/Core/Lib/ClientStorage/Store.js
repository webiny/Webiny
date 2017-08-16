import store from 'store';

class Store {
    set(key, value) {
        return store.set(key, value);
    }

    get(key) {
        return store.get(key);
    }

    remove(key) {
        return store.remove(key);
    }

    clear() {
        return store.clearAll();
    }
}

export default Store;
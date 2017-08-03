import store from 'store';

class Store {
    set(key, value) {
        store.set(key, value);
        return this;
    }

    get(key) {
        return store.get(key);
    }

    remove(key) {
        store.remove(key);
        return this;
    }

    clear() {
        store.clearAll();
        return this;
    }
}

export default Store;
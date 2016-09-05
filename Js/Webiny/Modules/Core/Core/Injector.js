const container = {};

/**
 * Injector class serves as a container for functions and data you want to make globally available to all apps
 */
class Injector {

    debug() {
        console.log(container);
    }

    register(name, value) {
        if (_.has(container, name)) {
            return console.warn(`Name '${name}' is already registered!`);
        }
        container[name] = value;
        return this;
    }

    exists(name) {
        return _.has(container, name);
    }

    get(name) {
        return _.get(container, name);
    }

}

export default new Injector;

const container = [];

/**
 * Injector class serves as a container for functions and data you want to make globally available to all apps
 */
class Injector {

    debug() {
        console.log(container);
    }

    register(name, value, tags = []) {
        if (_.find(container, {name})) {
            return console.warn(`Name '${name}' is already registered!`);
        }
        container.push({name, value, tags});
        return this;
    }

    exists(name) {
        return _.find(container, {name});
    }

    get(name) {
        return _.find(container, {name});
    }

    getByTag(tag) {
        return _.filter(container, s => s.tags.indexOf(tag) > -1);
    }

}

export default new Injector;

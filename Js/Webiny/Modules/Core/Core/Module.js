import Webiny from 'Webiny';

class Module {

    /**
     * @param app
     */
    constructor(app) {
        this.app = app;
        this.components = {};
        this.type = 'default';
    }

    /**
     * @param components
     * @returns {Module}
     */
    setComponents(components) {
        _.forEach(components, (value, key) => {
            _.set(this.app, `${this.name}.Components.` + key, value);
        });
        return this;
    }

    /**
     * @param views
     * @returns {Module}
     */
    setViews(views) {
        _.forEach(views, (value, key) => {
            _.set(this.app, `${this.name}.Views.` + key, value);
        });
        return this;
    }

    /**
     * @param actions
     * @returns {Module}
     */
    setActions(actions) {
        _.forEach(actions, (value, key) => {
            _.set(this.app, `${this.name}.Actions.` + key, value);
        });
        return this;
    }

    /**
     * @returns {Module}
     */
    setRoutes(...routes) {
        _.each(routes, route => {
            route.setModule(this);
            Webiny.Router.addRoute(route);
        });
        return this;
    }

    getName() {
        return this.name;
    }

    getNamespace(addon = '') {
        return `${this.name}.${addon}`;
    }

    /**
     * @param content
     * @returns {Module}
     */
    addDefaultComponents(content) {
        Webiny.Router.addDefaultComponents(content);
        return this;
    }

    injectComponents(obj) {
        _.forIn(obj, (value, key) => {
            obj[key] = _.get(this.app, `${this.name}.` + value);
        });

        return obj;
    }

    /**
     * Override if needed
     * @returns {Module}
     */
    run() {
        return this;
    }
}

export default Module;

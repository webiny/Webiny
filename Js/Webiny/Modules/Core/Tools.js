import Webiny from 'Webiny';

class Tools {

    createUID() {
        const delim = '-';

        function s4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        return s4() + s4() + delim + s4() + delim + s4() + delim + s4() + delim + s4() + s4() + s4();
    }

    keys(obj) {
        if (obj instanceof Array) {
            return [...obj.keys()];
        }
        return Object.keys(obj);
    }

    toSlug(str) {
        const trimmed = _.trim(str);
        const url = trimmed.replace(/[^a-z0-9-\/]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
        if (url.length) {
            return url;
        }

        return null;
    }

    removeKeys(collection, excludeKeys = ['$key']) {
        function omitFn(value) {
            if (value && typeof value === 'object') {
                excludeKeys.forEach(key => {
                    delete value[key];
                });
            }
        }

        return _.cloneDeepWith(collection, omitFn);
    }

    getAppsSettings() {
        const settings = [];
        _.each(Webiny.Apps, jsApps => {
            _.each(jsApps, app => {
                _.each(app.modules, module => {
                    _.each(module.settings, s => {
                        settings.push(s);
                    });
                });
            });
        });
        return settings;
    }

    getAppsMenus() {
        const menus = {};
        _.each(Webiny.Apps, jsApps => {
            _.each(jsApps, app => {
                _.each(app.modules, module => {
                    _.each(module.menus, menu => {
                        const key = menu.key;
                        if (key in menus) {
                            _.map(menu.route, route => {
                                menus[key].route.push(route);
                            });
                        } else {
                            menus[key] = menu.clone();
                        }
                    });
                });
            });
        });

        return _.values(menus);
    }

    saveUiState(ui, key = null) {
        key = key || ui;
        const component = Webiny.Ui.Dispatcher.get(ui);
        if (component) {
            const data = component.getData ? component.getData() : component.state;
            localStorage[key] = JSON.stringify(data);
            console.info('Info: Component state saved to "localStorage.' + key + '"!');
            return data;
        }
        console.warn('Warning: Component was not found!');
    }

    loadUiState(ui, key = null) {
        key = key || ui;
        const component = Webiny.Ui.Dispatcher.get(ui);
        if (component && localStorage[key]) {
            const data = JSON.parse(localStorage[key]);
            if (component.setData) {
                component.setData(data);
            } else {
                component.setState(data);
            }
            console.info('Info: Component state successfully loaded from "localStorage.' + key + '"!');
            return data;
        }
        console.warn('Warning: Component or data was not found!');
    }
}

export default new Tools;
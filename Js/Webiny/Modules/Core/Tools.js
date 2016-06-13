import Webiny from 'Webiny';

class Tools {

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
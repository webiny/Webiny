const Webiny = {
    Apps: {},
    Assets: (appName, path) => {
        const env = WebinyBootstrap.env;
        const app = _.get(Webiny.Apps, appName);
        const appPath = app.meta.version ? appName.replace('.', '/' + app.meta.version + '/') : appName.replace('.', '/');
        return '/build/' + env + '/' + appPath + '/' + path;
    },
    Configure: (path, config) => {
        let target = Webiny.Apps;
        if (path.indexOf('Webiny.Ui') === 0) {
            target = Webiny.Ui;
            path = path.replace('Webiny.Ui', '');
        }

        const props = _.get(target, path + '.defaultProps');
        _.forIn(config, (value, key) => {
            props[key] = value;
        });
    },
    Ui: {}
};

export default Webiny;

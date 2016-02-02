const Webiny = {
    Apps: {},
    Assets: (appName, path) => {
        const env = WebinyBootstrap.env;
        return '/build/' + env + '/' + appName.replace('.', '/') + '/' + path;
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

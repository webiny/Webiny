const Webiny = {
    Apps: {},
    Assets: (appName, path) => {
        const app = _.get(Webiny.Apps, appName);
        if (!app) {
            console.warn('Warning: attempting to access assets of a missing app "' + appName + '". (' + path + ')');
        }
        return _.get(app, 'meta.assets.path', '') + '/' + _.trimStart(path, '/');
    },
    Configure: (path, config) => {
        let target = Webiny.Apps;
        if (path.indexOf('Webiny.Ui') === 0) {
            target = Webiny.Ui;
            path = path.replace('Webiny.Ui', '');
        }

        const props = _.get(target, path + '.defaultProps');
        if (props) {
            _.merge(props, config);
        }
    },
    Ui: {}
};

export default Webiny;

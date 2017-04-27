import Component from './../Core/Component';

const configurations = {};

class LazyLoad extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loaded: false,
            modules: null
        };
    }

    componentWillMount() {
        super.componentDidMount();

        const toLoad = this.props.modules;
        let modules = {};
        if (_.isArray(toLoad)) {
            toLoad.map((name, key) => {
                // String value is most probably a Core/Webiny component name
                if (_.isString(name)) {
                    modules[name] = name;
                    return;
                }

                // Function value is most probably a vendor that does not export anything (attaches to jQuery or window directly)
                if (_.isFunction(name)) {
                    modules[key] = name;
                    return;
                }

                // Object value is a custom map of modules (Core/Webiny components or import statements) to a desired prop name
                if (_.isPlainObject(name)) {
                    _.each(name, (value, key) => {
                        modules[key] = value;
                    })
                }
            });
        } else {
            modules = toLoad;
        }

        const keys = Object.keys(modules);

        const imports = keys.map(key => {
            const module = modules[key];
            if (_.isString(module)) {
                // If string is given, we expect it to be a Core component name
                return import(`Core/Webiny/Ui/Components/${module}/index`).then(m => m.default);
            }
            // If a function is given - execute it and return whatever that function is returning
            return module().then(m => m.hasOwnProperty('default') ? m.default : m);
        });

        Promise.all(imports).then(values => {
            // Map loaded modules to requested modules object
            const modules = {};
            keys.map((key, i) => {
                modules[key] = values[i];
            });
            return modules;
        }).then(modules => {
            if (!this.isMounted()) {
                return null;
            }

            // Configure modules
            _.each(modules, (module, name) => {
                // Only configure modules that are requested as string
                if (_.isString(name) && _.has(configurations, name) && !configurations[name].configured) {
                    _.get(configurations[name], 'configs', []).map(config => config(module));
                    configurations[name].configured = true;
                }
            });

            // Finish loading and render content
            this.setState({loaded: true, modules});
        });
    }

    static setConfiguration(name, config) {
        const current = _.get(configurations, 'name', {configured: false, configs: []});
        current.configs.push(config);
        configurations[name] = current;
    }
}

LazyLoad.defaultProps = {
    renderer() {
        if (this.state.loaded) {
            try {
                return this.props.children(this.state.modules);
            } catch (e) {
                console.error(e);
            }
        }
        return null;
    }
};

export default LazyLoad;
import Component from './../Core/Component';

// This object contains module providers registered by other apps (this allows lazy loading of chunks from other apps)
const registeredModules = {};

// This object will contain optional configurations for components
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
        super.componentWillMount();

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
            let module = modules[key];
            if (_.isString(module)) {
                module = registeredModules[module];
            }
            // If a function is given - execute it and return either the default export (if exists) or the entire export
            return Promise.resolve(module()).then(m => m.hasOwnProperty('default') ? m.default : m);
        });

        Promise.all(imports).then(values => {
            // Map loaded modules to requested modules object
            const modules = {};
            keys.map((key, i) => {
                // Only assign modules that export something (often vendor libraries like owlCarousel, select2, etc. do not export anything)
                if (!_.isNil(values[i])) {
                    modules[key] = values[i];
                }
            });
            return modules;
        }).then(modules => {
            if (!this.isMounted()) {
                return null;
            }

            // Configure modules
            const configure = [];
            _.each(modules, (module, name) => {
                // Only configure modules that are requested as string
                if (_.isString(name) && _.has(configurations, name) && !configurations[name].configured) {
                    // build promise chain to configure each component
                    let chain = Promise.resolve();
                    _.get(configurations[name], 'configs', []).map(config => {
                        // We support async configuration functions to allow 3rd party apps to lazy load their configuration code
                        // when the component is actually used
                        chain = chain.then(() => config(module));
                    });
                    configure.push(chain.then(() => configurations[name].configured = true));
                }
            });

            return Promise.all(configure).then(() => {
                // Finish loading and render content
                this.setState({loaded: true, modules});
            });
        });
    }

    static setModule(name, provider) {
        registeredModules[name] = provider;
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
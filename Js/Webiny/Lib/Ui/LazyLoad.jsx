import Component from './../Core/Component';

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
            toLoad.map(name => {
                if (_.isString(name)) {
                    modules[name] = name
                }

                if (_.isPlainObject(name)) {
                    _.each(name, (value, key) => {
                        modules[key] = value;
                    })
                }
            });
        } else {
            modules = _.clone(toLoad);
        }

        const keys = Object.keys(modules);

        const imports = keys.map(key => {
            const module = modules[key];
            if (_.isString(module)) {
                // If string is given, we expect it to be a Core component name
                return import(`Webiny/Ui/Components/${module}/index`).then(m => m.default);
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
            this.setState({loaded: true, modules});
        });
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
import Webiny from 'Webiny';

class App {

    constructor(name) {
        this.name = name;
        this.modules = [];
        this.onBeforeRender = _.noop;
    }

    addModules(modules) {
        this.modules = Object.keys(modules).map(k => modules[k]);
        return this;
    }

    setInitialElement(element) {
        this.element = element;
        return this;
    }

    run(mountPoint = null) {
        console.info(this.name + ' app bootstrap');

        const promises = this.modules.map(config => {
            if (config.module) {
                return WebinyBootstrap.import(this.name.replace('.', '/') + '/Modules/' + config.name).then(m => {
                    if (m.default) {
                        return this.setupModule(new m.default(this), config);
                    }
                    return this.setupModule(new Webiny.Module(this), config);
                });
            }

            return this.setupModule(new Webiny.Module(this), config);
        });


        this.modules = [];
        return Promise.all(promises).then(modules => {
            modules.forEach(module => {
                module.run();
                this.modules.push(module);
            });

            return Q(this.onBeforeRender()).then(() => {
                if (mountPoint) {
                    ReactDOM.render(this.element, mountPoint);
                }
            });
        });
    }

    setupModule(module, config) {
        if (!module.name) {
            module.name = config.name;
        }

        const promises = config.folders.map(x => {
            return WebinyBootstrap.import(this.name.replace('.', '/') + '/Modules/' + module.name + '/' + x + '/' + x).then(f => {
                const methodName = 'set' + x;
                return module[methodName](f.default);
            });
        });

        let routes = _.noop;
        if (config.routes) {
            routes = () => {
                WebinyBootstrap.import(this.name.replace('.', '/') + '/Modules/' + module.name + '/Routes').then(f => {
                    const moduleRoutes = [];
                    if (f.default.routes) {
                        _.forIn(f.default.routes, (rConfig, rName) => {
                            moduleRoutes.push(new Webiny.Route(rName, rConfig.url, module.injectComponents(rConfig.views)));
                        });
                        module.setRoutes(...moduleRoutes);
                    }

                    if (f.default.defaultComponents) {
                        module.addDefaultComponents(module.injectComponents(f.default.defaultComponents));
                    }

                    return f.default;
                });
            }
        }

        return Promise.all(promises).then(() => routes()).then(() => module);
    }

    beforeRender(callback) {
        this.onBeforeRender = callback;
        return this;
    }
}

export default App;

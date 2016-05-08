import Webiny from 'Webiny';
import RootElement from './../Ui/RootElement';

class App {

    constructor(name) {
        this.name = name;
        this.modules = [];
        this.onBeforeRender = _.noop;
        this.element = null;
    }

    addModules(modules) {
        this.modules = Object.keys(modules).map(k => modules[k]);
        return this;
    }

    setRootElement(element) {
        this.element = element;
        return this;
    }

    run(mountPoint = null) {
        console.info(this.name + ' app bootstrap');

        // Import and setup all modules
        const promises = this.modules.map(config => {
            if (config.module) {
                return WebinyBootstrap.import(this.name.replace('.', '/') + '/Modules/' + config.name).then(m => {
                    const module = m.default ? new m.default(this) : new Webiny.Module(this);
                    // Run setup method (does nothing unless module has a custom module class)
                    module.init();
                    return this.setupModule(module, config);
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
                    ReactDOM.render(_.isNull(this.element) ? React.createElement(RootElement) : this.element, mountPoint);
                }
            });
        });
    }

    setupModule(module, config) {
        if (!module.name) {
            module.name = config.name;
        }

        // Automatically set Actions, Components and Views
        const promises = config.folders.map(x => {
            return WebinyBootstrap.import(this.name.replace('.', '/') + '/Modules/' + module.name + '/' + x + '/' + x).then(f => {
                const methodName = 'register' + x;
                return module[methodName](f.default);
            });
        });

        return Promise.all(promises).then(() => module);
    }

    beforeRender(callback) {
        this.onBeforeRender = callback;
        return this;
    }
}

export default App;

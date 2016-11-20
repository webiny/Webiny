import Webiny from 'Webiny';
import RootElement from './../Ui/RootElement';

class App {

    constructor(name, dependencies = []) {
        this.name = name;
        this.modules = [];
        this.dependencies = _.isArray(dependencies) ? dependencies : [];
        this.onBeforeRender = _.noop;
        this.element = 'default';
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
                if (mountPoint && this.element !== null) {
                    ReactDOM.render(this.element === 'default' ? React.createElement(RootElement) : this.element, mountPoint);
                }
            });
        });
    }

    setupModule(module, config) {
        if (!module.name) {
            module.name = config.name;
        }

        module.init();

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

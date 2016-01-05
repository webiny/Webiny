class App {

    constructor(name) {
        this.name = name;
        this.modules = [];
        this.onBeforeRender = _.noop;
    }

    addModules(modules) {
        this.modules = modules;
        return this;
    }

    setInitialElement(element) {
        this.element = element;
        return this;
    }

    run(mountPoint = null) {
        console.info(this.name + ' app bootstrap');
        const promises = this.modules.map(x => WebinyBootstrap.import(this.name.replace('.', '/') + '/Modules/' + x));
        this.modules = [];
        return Promise.all(promises).then(modules => {
            modules.forEach(m => {
                const module = new m.default(this);
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

    beforeRender(callback) {
        this.onBeforeRender = callback;
        return this;
    }
}

export default App;

class WebinyApp {

    constructor() {
        this.name = 'Webiny';
        this.modules = [];

        window.Webiny = {
            Apps: {},
            Ui: {}
        };
    }

    addModules(modules) {
        this.modules = modules;
        return this;
    }

    run() {
        this.modules.splice(this.modules.indexOf('Core'), 1);
        this.modules.unshift('Core');
        const imported = [];
        let queue = Q();

        this.modules.map(name => {
            queue = queue.then(() => {
                return WebinyBootstrap.import('Modules/' + name + '/Module').then(m => {
                    const module = new m.default();
                    imported.push(module);
                    module.run();
                });
            });
        });

        this.modules = imported;
        return queue;
    }
}

export default new WebinyApp;

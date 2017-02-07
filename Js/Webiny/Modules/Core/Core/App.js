class App {

    constructor(name) {
        this.name = name;
        this.modules = [];
        this.onBeforeRender = _.noop;
    }

    run() {
        console.info(this.name + ' app bootstrap');
        this.modules.map(m => m.init());
        return Promise.resolve(this.onBeforeRender());
    }

    beforeRender(callback = null) {
        if (!_.isFunction(callback)) {
            return this.onBeforeRender;
        }

        this.onBeforeRender = callback;
        return this;
    }

    getAuth() {
        return null;
    }
}

export default App;
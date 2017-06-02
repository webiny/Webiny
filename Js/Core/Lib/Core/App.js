class App {

    constructor(name) {
        this.name = name;
        this.modules = [];
        this.onBeforeRender = _.noop;
    }

    run() {
        this.modules.map(m => m.init());
        return Promise.resolve(this.onBeforeRender()).then(() => {
            console.timeStamp('App run: ' + this.name);
        });
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
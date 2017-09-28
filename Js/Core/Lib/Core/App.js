import _ from 'lodash';

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

    /**
     * Content returned from this function will be presented as Marketplace mini-onboarding in a modal dialog.
     * Return React content you want to see inside the dialog.
     *
     * @returns {null}
     */
    onInstalled() {
        return Promise.resolve();
    }
}

export default App;
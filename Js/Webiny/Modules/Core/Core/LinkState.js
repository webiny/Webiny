class LinkState {

    constructor(component, key, callback, defaultValue = null) {
        this.component = component;
        this.key = key;
        this.callback = callback;
        this.defaultValue = defaultValue;
    }

    create() {
        return {
            value: this.__getValue(this.key),
            onChange: this.__createStateKeySetter()
        };
    }

    __getValue(key) {
        return _.get(this.component.state, key, this.defaultValue);
    }

    __createStateKeySetter() {
        const component = this.component;
        const key = this.key;

        const _this = this;
        return function stateKeySetter(value, callback = _.noop) {
            return new Promise(resolve => {
                if (typeof value === 'undefined') {
                    value = false;
                }
                const oldValue = _this.__getValue(key);

                let partialState = component.state;
                _.set(partialState, key, value);
                component.setState(partialState, () => {
                    callback(value, oldValue);
                    partialState = null;

                    if (_this.callback) {
                        _this.callback(value, oldValue);
                    }
                    resolve(value, oldValue);
                });
            });
        };
    }
}

export default LinkState;

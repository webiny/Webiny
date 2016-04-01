class LinkState {

    constructor(component, key, callback) {
        this.component = component;
        this.key = key;
        this.callback = callback;
    }

    create() {
        return {
            value: this.__getValue(this.key),
            requestChange: this.__createStateKeySetter()
        };
    }

    __getValue(key) {
        return _.get(this.component.state, key);
    }

    __createStateKeySetter() {
        const component = this.component;
        const key = this.key;

        const _this = this;
        return function stateKeySetter(value, callback = _.noop) {
            if (typeof value === 'undefined') {
                value = false;
            }
            const oldValue = _this.__getValue(key);

            let partialState = component.state;
            _.set(partialState, key, value);
            component.setState(partialState, callback);
            partialState = null;

            if (_this.callback) {
                _this.callback(value, oldValue);
            }
        };
    }
}

export default LinkState;

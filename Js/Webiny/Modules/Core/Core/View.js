import Component from './Component';

class View extends Component {

    constructor(props) {
        super(props);

        this.bindMethods('createOptions,apiParams');
    }

    apiParams(params) {
        // TODO: need a simple Injector (like current Registry)
        // TODO: Things like `apiParams` will be constructed using a form in UI builder
        // TODO: values like '@activeLocation' will be dynamic, and are accessed through injector
        // TODO: Modules responsible for these values should make these values available to injector on module initialization
        // TODO: '@route:id', etc. will give access to Router params
        return params;
    }

    /**
     * Create key=>value options for checkbox/radio/dropdown
     * @param store Name of the store to use or array of entities to iterate
     * @param stateKey State key to assign generated object
     * @param key Property name to use as 'key'
     * @param value Property name to use as 'value'
     */
    createOptions(store, stateKey, key, value) {
        if (_.isEmpty(store)) {
            store = [];
        }

        let data = null;
        if (_.isArray(store)) {
            data = Q({data: store});
        } else {
            data = this.getStore(store).getState();
        }
        return data.then(response => {
            const items = {};
            _.each(response.data, item => {
                let option = _.isFunction(value) ? value(item) : item[value];
                if (!_.isString(option)) {
                    option = ReactDOMServer.renderToStaticMarkup(option);
                }
                items[item[key]] = option;
            });

            const partialState = this.state;
            _.set(partialState, stateKey, items);
            this.setState(partialState);
            return response.data;
        });
    }
}

export default View;

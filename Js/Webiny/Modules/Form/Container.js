import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import Validator from './../Validation/Validator';

class Container extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: {},
            initialModel: {},
            error: null
        };

        this.isValid = null;
        this.watches = {};
        this.inputs = {};
        this.tabs = {};

        this.parsingTabsIndex = 0;

        if (props.api) {
            Webiny.Mixins.ApiComponent.extend(this);
        }

        this.bindMethods(
            'getModel',
            'setModel',
            'loadModel',
            'registerInputs',
            'registerInput',
            'attachToForm',
            'attachValidators',
            'detachFromForm',
            'validateInput',
            'submit',
            'reset',
            'cancel',
            'validate',
            'onSubmit',
            'onCancel',
            'onInvalid',
            'onReset',
            'renderContent'
        );
    }

    componentWillMount() {
        super.componentWillMount();
        this.setState({model: _.merge({}, this.props.defaultModel || {})});

        if (this.props.loadModel) {
            return this.props.loadModel.call(this).then(model => {
                this.setState({model, loading: false, initialModel: model});
            });
        }

        this.loadModel(this.props.id);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.abort();
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (props.id !== this.props.id) {
            this.loadModel(props.id);
        }
    }

    /**
     * Add a callback that will be triggered each time a given input name value is changed
     *
     * @param name
     * @param callback
     * @returns {Function}
     */
    watch(name, callback) {
        const watches = this.watches[name] || new Set();
        watches.add(callback);
        this.watches[name] = watches;
        return () => {
            this.watches[name].delete(callback);
        };
    }

    /**
     * Get mounted input component instance
     * @param name
     * @returns {*}
     */
    getInput(name) {
        return _.get(this.inputs, name + '.component');
    }

    /**
     * ERROR METHODS
     */

    getError(key = null) {
        if (!key) {
            return this.state.error;
        }

        return _.get(this.state.error, key);
    }

    hasError() {
        return this.state.error !== null;
    }

    /**
     * LOADING METHODS
     */

    showLoading() {
        this.setState({loading: true, error: null});
    }

    hideLoading() {
        this.setState({loading: false});
    }

    isLoading() {
        return this.state.loading;
    }


    /**
     * "ON" CALLBACK METHODS
     */
    onSubmit(model) {
        this.showLoading();
        if (model.id) {
            return this.api.patch(model.id, model).then(apiResponse => {
                this.hideLoading();
                const onSubmitSuccess = this.props.onSubmitSuccess;
                if (!apiResponse.isError()) {
                    this.setState({model: apiResponse.getData(), error: null});
                    if (_.isFunction(this.props.onSuccessGrowl)) {
                        Webiny.Growl.success(this.props.onSuccessGrowl(model));
                    }
                    if (_.isFunction(onSubmitSuccess)) {
                        return onSubmitSuccess.bind(this)(apiResponse);
                    }

                    if (_.isString(onSubmitSuccess)) {
                        return Webiny.Router.goToRoute(onSubmitSuccess);
                    }

                    return apiResponse;
                }
                this.setState({error: apiResponse});
                return apiResponse;
            });
        }

        return this.api.post('/', model).then(apiResponse => {
            this.hideLoading();
            const onSubmitSuccess = this.props.onSubmitSuccess;
            if (!apiResponse.isError()) {
                this.setState({model: apiResponse.getData(), error: null});
                if (_.isFunction(this.props.onSuccessGrowl)) {
                    Webiny.Growl.success(this.props.onSuccessGrowl(model));
                }
                if (_.isFunction(onSubmitSuccess)) {
                    return onSubmitSuccess.bind(this)(apiResponse);
                }

                if (_.isString(onSubmitSuccess)) {
                    return Webiny.Router.goToRoute(onSubmitSuccess);
                }
            }
            this.setState({error: apiResponse});
            return apiResponse;
        });
    }

    onInvalid() {
        if (_.isFunction(this.props.onInvalid)) {
            this.props.onInvalid();
        }
    }

    onReset() {
        if (this.props.onReset) {
            this.props.onReset();
        }
    }

    onCancel() {
        console.log('Form Container [ON CANCEL]');
        if (_.isString(this.props.onCancel)) {
            Webiny.Router.goToRoute(this.props.onCancel);
        } else if (_.isFunction(this.props.onCancel)) {
            this.props.onCancel();
        }
    }

    /**
     * MODEL METHODS
     */

    /**
     * Get form container model
     * @param key
     * @returns {*}
     */
    getModel(key = null) {
        const data = _.merge({}, this.state.model);
        if (key) {
            return _.get(data, key);
        }

        return data;
    }

    /**
     * Set form model (merge current model with given model object)
     * @param key object or string key
     * @param value callable or value (if key is a string)
     * @param callback callable (if key is a string)
     * @returns {Form}
     */
    setModel(key, value = null, callback = null) {
        if (_.isObject(key)) {
            _.merge(this.state.model, key);
            this.setState({model: this.state.model}, value);
        }

        if (_.isString(key)) {
            _.set(this.state.model, key, value);
            this.setState({model: this.state.model}, callback);
        }
        return this;
    }

    loadModel(id = null) {
        if (!id) {
            if (this.props.connectToRouter) {
                id = Webiny.Router.getParams('id');
            }
        }

        if (id) {
            this.showLoading();
            this.request = this.api.execute(this.api.httpMethod, id).then(apiResponse => {
                if (apiResponse.isAborted() || apiResponse.isError()) {
                    this.onCancel();
                    return;
                }
                if (this.props.prepareLoadedData) {
                    this.setState({model: this.props.prepareLoadedData(apiResponse.getData()), loading: false});
                    return;
                }
                this.setState({model: apiResponse.getData(), loading: false});
            });
            return this.request;
        }
    }


    /**
     * MAIN FORM ACTION METHODS
     */

    submit(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        return this.validate().then(valid => {
            if (valid) {
                // If onSubmit was passed through props, execute it. Otherwise proceed with default behaviour.
                if (this.props.onSubmit) {
                    return this.props.onSubmit(this.state.model, this);
                }
                return this.onSubmit(this.state.model);
            }
            return this.onInvalid();

        });
    }

    reset() {
        _.forIn(this.inputs, cmp => {
            cmp.component.setState({isValid: null});
        });
        this.isValid = null;

        if (this.props.onReset) {
            this.props.onReset();
        }
        this.setState({model: this.state.initialModel});
    }

    cancel() {
        console.log('Form Container [ON CANCEL]');
        if (_.isString(this.props.onCancel)) {
            Webiny.Router.goToRoute(this.props.onCancel);
        } else if (_.isFunction(this.props.onCancel)) {
            this.props.onCancel();
        }
    }

    validate() {
        let allIsValid = true;

        const inputs = this.inputs;
        // Inputs must be validated in a queue because we may have async validators
        let chain = Q(allIsValid).then(valid => valid);
        Object.keys(inputs).forEach(name => {
            const cmp = inputs[name].component;
            const hasValidators = inputs[name] && inputs[name].validators;
            const shouldValidate = (!cmp.hasValue() && cmp.isRequired()) || (cmp.hasValue() && cmp.state.isValid !== true);

            if (hasValidators && shouldValidate) {
                if (cmp.state.isValid === false || cmp.state.isValid === null) {
                    chain = chain.then(() => {
                        return this.validateInput(cmp).then(validationResult => {
                            if (validationResult === false) {
                                if (allIsValid) {
                                    // If input is located in a Tabs component, focus the right Tab
                                    // Do it only for the first failed input!
                                    const inputTabs = cmp.props.__tabs;
                                    if (inputTabs) {
                                        this.tabs[inputTabs.id].selectTab(inputTabs.tab);
                                    }
                                }
                                allIsValid = false;
                            }
                            return allIsValid;
                        });
                    });
                }
            }
        });

        return chain;
    }

    /**
     * HELPER METHODS FOR REGISTERING INPUTS
     */

    /**
     * @private
     * @param input
     * @returns {*}
     */
    registerInput(input) {
        if (typeof input !== 'object' || input === null) {
            return input;
        }

        // Do not descend into nested Form.Container
        if (input.type && input.type === Ui.Form.Container) {
            return input;
        }

        if (input.props && input.props.name) {
            // Build new input props
            const newProps = {
                attachToForm: this.attachToForm,
                attachValidators: this.attachValidators,
                detachFromForm: this.detachFromForm,
                validateInput: this.validateInput,
                form: this
            };

            // Add onChange callback to valueLink
            const name = _.upperFirst(_.camelCase(input.props.name));

            // Callback can be set on Container or on input itself
            const callback = _.get(input.props, 'onChange', _.get(this.props, 'onChange' + name, _.noop));

            // Input changed callback, triggered on each input change
            const changeCallback = function inputChanged(newValue) {
                callback.call(this, newValue, this.inputs[input.props.name].component);
                // See if there is a watch registered for changed input
                const watches = this.watches[input.props.name] || new Set();
                _.map(Array.from(watches), w => w(newValue));
            };

            newProps['valueLink'] = this.bindTo('model.' + input.props.name, changeCallback.bind(this), input.props.defaultValue);
            if (this.parsingTabsIndex > 0) {
                newProps['__tabs'] = {id: 'tabs-' + this.parsingTabsIndex, tab: this.parsingTabIndex};
            }

            return React.cloneElement(input, newProps, input.props && input.props.children);
        }

        // Track Tabs to be able to focus the relevant tab when validation fails
        if (input.type && input.type === Ui.Tabs.Tabs) {
            this.parsingTabsIndex++;
            this.parsingTabIndex = -1;

            const tabsProps = _.omit(input.props, ['key', 'ref']);
            _.merge(tabsProps, {
                __tabsId: 'tabs-' + this.parsingTabsIndex,
                attachToForm: this.attachToForm,
                detachFromForm: this.detachFromForm,
                form: this
            });

            const tabsContent = React.cloneElement(input, tabsProps, this.registerInputs(input.props && input.props.children));
            this.parsingTabsIndex--;
            return tabsContent;
        }

        if (input.type && input.type === Ui.Tabs.Tab && this.parsingTabsIndex > 0) {
            this.parsingTabIndex++;
        }

        return React.cloneElement(input, _.omit(input.props, ['key', 'ref']), this.registerInputs(input.props && input.props.children));
    }

    /**
     * @private
     * @param children
     * @returns {*}
     */
    registerInputs(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.registerInput, this);
    }

    attachValidators(props) {
        this.inputs[props.name].validators = Validator.parseValidateProperty(props.validate);
        this.inputs[props.name].messages = Validator.parseCustomValidationMessages(props.children);
    }

    attachToForm(component) {
        // Tabs component is stored separately from inputs
        if (component.props.__tabsId) {
            this.tabs[component.props.__tabsId] = component;
            return;
        }

        this.inputs[component.props.name] = {
            component,
            model: component.getValue()
        };
        this.attachValidators(component.props);
    }

    detachFromForm(component) {
        delete this.inputs[component.props.name];
    }

    validateInput(component) {
        const validators = this.inputs[component.props.name].validators;
        const hasValidators = Webiny.Tools.keys(validators).length;
        const messages = this.inputs[component.props.name].messages;
        // Validate input
        return Q(Validator.validate(component.getValue(), validators, this.inputs)).then(validationResults => {
            if (hasValidators) {
                const isValid = component.getValue() === null ? null : true;
                component.setState({isValid, validationResults});
            }
            return validationResults;
        }).catch(validationError => {
            // Set custom error message if defined
            const validator = validationError.validator;
            if (validator in messages) {
                validationError.setMessage(messages[validator]);
            }

            // Set component state to reflect validation error
            component.setState({
                isValid: false,
                validationMessage: validationError.message,
                validationResults: false
            });

            return false;
        });
    }

    /**
     * Render Container content
     * @returns {*}
     */
    renderContent() {
        const children = this.props.children;
        if (_.isFunction(children)) {
            return this.registerInputs(children.call(this, _.clone(this.state.model), this));
        }
        return this.registerInputs(children);
    }
}

Container.defaultProps = {
    connectToRouter: false,
    onSuccessGrowl: () => {
        return 'Your record was saved successfully!';
    },
    renderer() {
        return (
            <webiny-form-container>{this.renderContent()}</webiny-form-container>
        );
    }
};

export default Container;
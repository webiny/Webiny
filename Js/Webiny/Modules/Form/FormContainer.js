import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FormContainer extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: {},
            initialModel: {},
            error: null,
            loading: false,
            submitDisabled: false,
            wasSubmitted: false
        };

        this.isValid = null;
        this.watches = {};
        this.inputs = {};
        this.tabs = {};
        this.growlId = _.uniqueId('growl-');

        this.parsingTabsIndex = 0;

        if (props.api) {
            Webiny.Mixins.ApiComponent.extend(this);
        }

        this.noParsing = [
            Ui.List.Table
        ];

        this.bindMethods(
            'resetForm',
            'getModel',
            'setModel',
            'loadModel',
            'registerComponents',
            'registerComponent',
            'attachToForm',
            'attachValidators',
            'detachFromForm',
            'validateInput',
            'submit',
            'cancel',
            'validate',
            'onSubmit',
            'onInvalid',
            'isSubmitDisabled',
            'enableSubmit',
            'disableSubmit',
            'handleApiError',
            '__renderContent',
            '__processSubmitResponse',
            '__focusTab',
            '__onKeyDown'
        );
    }

    componentWillMount() {
        super.componentWillMount();
        const model = _.merge({}, this.props.defaultModel || {});
        this.setState({model, initialModel: model});

        if (this.props.loadModel) {
            return this.props.loadModel.call(this, this).then(customModel => {
                const mergedModel = _.merge({}, this.props.defaultModel || {}, customModel);
                this.setState({model: mergedModel, loading: false, initialModel: _.cloneDeep(mergedModel)});
            });
        }

        this.loadModel(this.props.id, this.props.model);
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.request) {
            this.request.abort();
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (props.id !== this.props.id || !_.isEqual(props.model, this.props.model)) {
            this.loadModel(props.id, props.model);
        }
    }

    isSubmitDisabled() {
        return this.state.submitDisabled;
    }

    enableSubmit() {
        this.setState({submitDisabled: false});
    }

    disableSubmit(message = '') {
        this.setState({submitDisabled: message || true});
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
        return this;
    }

    hideLoading() {
        this.setState({loading: false});
        return this;
    }

    isLoading() {
        return this.state.loading;
    }

    /**
     * "ON" CALLBACK METHODS
     */
    onSubmit(model) {
        this.showLoading();
        this.__removeKeys(model);
        const config = {
            progress: pe => {
                // If total size is larger than 500Kb...
                if (pe.total > 500000) {
                    pe.progress = Math.round(pe.loaded / pe.total * 100);
                    this.props.onProgress.call(this, pe, this);
                }
            }
        };

        if (model.id) {
            return this.api.setConfig(config)
                .patch(this.api.url + '/' + model.id, model)
                .then(res => this.__processSubmitResponse(model, res))
                .then(this.enableSubmit);
        }

        return this.api.setConfig(config)[this.props.createHttpMethod](this.api.url, model)
            .then(res => this.__processSubmitResponse(model, res))
            .then(this.enableSubmit);
    }

    onInvalid() {
        if (_.isFunction(this.props.onInvalid)) {
            this.props.onInvalid();
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
        const data = _.cloneDeep(this.state.model);
        if (key) {
            return _.get(data, key);
        }

        return data;
    }

    /**
     * Get initial form model
     * @param key
     * @returns {*}
     */
    getInitialModel(key = null) {
        const data = _.cloneDeep(this.state.initialModel);
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

    /**
     * Reset initialModel and actual model of the Form and set all form inputs validation state to `null`
     *
     * @param model
     * @returns {FormContainer}
     */
    resetForm(model = {}) {
        this.setState({model, initialModel: model, wasSubmitted: false}, () => {
            Object.keys(this.inputs).forEach(name => {
                this.inputs[name].component.reset();
            });
        });
        return this;
    }

    loadModel(id = null, model = null) {
        if (!id) {
            if (this.props.connectToRouter) {
                id = Webiny.Router.getParams('id');
            }
        }

        if (id) {
            if (this.request) {
                return this.request;
            }

            this.showLoading();
            this.request = this.api.execute(this.api.httpMethod, this.api.url + '/' + id).then(apiResponse => {
                this.request = null;
                if (apiResponse.isAborted()) {
                    return;
                }

                if (apiResponse.isError()) {
                    this.props.onFailure(apiResponse);
                    return;
                }

                if (this.props.prepareLoadedData) {
                    const newModel = _.merge({}, this.props.defaultModel || {}, this.props.prepareLoadedData(apiResponse.getData()));
                    this.setState({model: newModel, initialModel: _.cloneDeep(newModel), loading: false}, this.__processWatches);
                    return;
                }
                const newModel = _.merge({}, this.props.defaultModel || {}, apiResponse.getData());
                this.setState({model: newModel, initialModel: _.cloneDeep(newModel), loading: false}, this.__processWatches);
            });
            return this.request;
        }

        if (model) {
            model = _.merge({}, this.props.defaultModel || {}, model);
            // Find watches to trigger - this is mostly necessary on static forms
            const changes = [];
            _.each(this.watches, (watches, name) => {
                if (!_.isEqual(_.get(model, name), _.get(this.state.model, name))) {
                    changes.push(name);
                }
            });

            this.setState({model, initialModel: _.cloneDeep(model)}, () => this.__processWatches(changes));
        }
    }


    /**
     * MAIN FORM ACTION METHODS
     */

    submit(e) {
        if (e && e.preventDefault) {
            e.preventDefault();
        }

        if (this.state.submitDisabled !== false) {
            Webiny.Growl.info(this.state.submitDisabled, 'Please wait! Your data is being processed...');
            return false;
        }

        this.disableSubmit();
        this.setState({wasSubmitted: true});

        return this.validate().then(valid => {
            if (valid) {
                const model = this.__removeKeys(this.state.model);
                // If onSubmit was passed through props, execute it. Otherwise proceed with default behaviour.
                if (this.props.onSubmit) {
                    return this.props.onSubmit(model, this);
                }
                return this.onSubmit(model);
            }
            this.enableSubmit();
            return this.onInvalid();
        });
    }

    cancel() {
        if (_.isString(this.props.onCancel)) {
            Webiny.Router.goToRoute(this.props.onCancel);
        } else if (_.isFunction(this.props.onCancel)) {
            this.props.onCancel(this);
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
                                    this.__focusTab(cmp);
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

    // TODO: construct onChange callback to process watches, etc.
    bindTo(name, changeCallback = _.noop, defaultValue = null) {
        return super.bindTo('model.' + name, changeCallback, defaultValue);
    }

    /**
     * @private
     * @param input
     * @returns {*}
     */
    registerComponent(input) {
        if (typeof input !== 'object' || input === null || this.noParsing.indexOf(input.type) > -1) {
            return input;
        }

        // Do not descend into nested Form
        if (input.type && input.type === Ui.Form) {
            return input;
        }

        if (input.type && _.includes(this.props.injectInto(), input.type)) {
            input = React.cloneElement(input, {container: this});
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

            // Create an onChange callback
            const callback = _.get(input.props, 'onChange', _.noop);

            // Input changed callback, triggered on each input change
            const changeCallback = function inputChanged(newValue, oldValue) {
                const inputConfig = this.inputs[input.props.name];
                const component = inputConfig && inputConfig.component;
                if (component) {
                    callback.call(this, newValue, oldValue, component);
                    // See if there is a watch registered for changed input
                    const watches = this.watches[input.props.name] || new Set();
                    _.map(Array.from(watches), w => w(newValue, oldValue, component));
                }
                if (_.isFunction(this.props.onChange)) {
                    this.props.onChange(this.getModel(), this);
                }
            };

            // Assign value and onChange props
            _.assign(newProps, this.bindTo(input.props.name, changeCallback.bind(this), input.props.defaultValue));

            if (this.parsingTabsIndex > 0) {
                newProps['__tabs'] = {id: 'tabs-' + this.parsingTabsIndex, tab: this.parsingTabIndex};
            }

            return React.cloneElement(input, newProps, input.props && input.props.children);
        }

        // Track Tabs to be able to focus the relevant tab when validation fails
        if (input.type && input.type === Ui.Tabs) {
            this.parsingTabsIndex++;
            this.parsingTabIndex = -1;

            const tabsProps = _.omit(input.props, ['key', 'ref']);
            _.merge(tabsProps, {
                __tabsId: 'tabs-' + this.parsingTabsIndex,
                attachToForm: this.attachToForm,
                detachFromForm: this.detachFromForm,
                form: this
            });

            const tabsContent = React.cloneElement(input, tabsProps, this.registerComponents(input.props && input.props.children));
            this.parsingTabsIndex--;
            return tabsContent;
        }

        if (input.type && input.type === Ui.Tabs.Tab && this.parsingTabsIndex > 0) {
            this.parsingTabIndex++;
        }

        return React.cloneElement(input, _.omit(input.props, ['key', 'ref']), this.registerComponents(input.props && input.props.children));
    }

    /**
     * @private
     * @param children
     * @returns {*}
     */
    registerComponents(children) {
        if (typeof children !== 'object' || children === null) {
            return children;
        }
        return React.Children.map(children, this.registerComponent, this);
    }

    attachValidators(props) {
        this.inputs[props.name].validators = Webiny.Validator.parseValidateProperty(props.validate);
        this.inputs[props.name].messages = Webiny.Validator.parseCustomValidationMessages(props.children);
    }

    attachToForm(component) {
        // Tabs component is stored separately from inputs
        if (component.props.__tabsId) {
            this.tabs[component.props.__tabsId] = component;
            return;
        }
        this.inputs[component.props.name] = {component};
        this.attachValidators(component.props);
    }

    detachFromForm(component) {
        delete this.inputs[component.props.name];
    }

    validateInput(component) {
        if (this.props.validateOnFirstSubmit && !this.state.wasSubmitted) {
            return Promise.resolve(null);
        }
        const validators = this.inputs[component.props.name].validators;
        const hasValidators = _.keys(validators).length;
        const messages = this.inputs[component.props.name].messages;
        // Validate input
        return Q(Webiny.Validator.validate(component.getValue(), validators, this.inputs)).then(validationResults => {
            if (hasValidators) {
                const isValid = component.getValue() === null ? null : true;
                component.setState({isValid, validationResults});
            } else {
                component.setState({isValid: null, validationMessage: null});
            }
            return validationResults;
        }).catch(validationError => {
            // Set custom error message if defined
            const validator = validationError.getValidator();
            if (validator in messages) {
                validationError.setMessage(messages[validator]);
            }

            // Set component state to reflect validation error
            component.setState({
                isValid: false,
                validationMessage: validationError.getMessage(),
                validationResults: false
            });

            return false;
        });
    }

    handleApiError(apiResponse) {
        this.setState({error: apiResponse}, () => {
            // Check error data and if validation error - try highlighting invalid fields
            const data = apiResponse.getData();
            if (_.isPlainObject(data)) {
                let tabFocused = false;
                _.each(data, (message, name) => {
                    const input = this.getInput(name);
                    if (input) {
                        if (!tabFocused) {
                            this.__focusTab(input);
                            tabFocused = true;
                        }
                        this.getInput(name).setInvalid(message);
                    }
                });
            }
        });
        return this;
    }

    /**
     * Render Container content
     * @returns {*}
     */
    __renderContent() {
        const children = this.props.children;
        if (!_.isFunction(children)) {
            throw new Error('Form must have a function as its only child!');
        }
        return this.registerComponents(children.call(this, _.cloneDeep(this.state.model), this));
    }

    __processSubmitResponse(model, apiResponse) {
        Webiny.Growl.remove(this.growlId);
        this.hideLoading();
        if (apiResponse.isError()) {
            this.handleApiError(apiResponse);
            return apiResponse;
        }

        const newModel = apiResponse.getData();
        this.setState({model: newModel, initialModel: _.cloneDeep(newModel), error: null});
        if (_.isFunction(this.props.onSuccessMessage)) {
            Webiny.Growl.success(this.props.onSuccessMessage(model));
        }

        const onSubmitSuccess = this.props.onSubmitSuccess;
        if (_.isFunction(onSubmitSuccess)) {
            return onSubmitSuccess.call(this, apiResponse, this);
        }

        if (_.isString(onSubmitSuccess)) {
            return Webiny.Router.goToRoute(onSubmitSuccess);
        }

        return apiResponse;
    }

    __focusTab(input) {
        const inputTabs = input.props.__tabs;
        if (inputTabs) {
            this.tabs[inputTabs.id].selectTab(inputTabs.tab);
        }
    }

    __processWatches(changes = null) {
        const source = changes ? _.pick(this.watches, changes) : this.watches;
        _.each(source, (watches, name) => {
            _.map(Array.from(watches), w => w(_.get(this.state.model, name)));
        });
    }

    __removeKeys(collection, excludeKeys = ['$key', '$index']) {
        function omitFn(value) {
            if (value && typeof value === 'object') {
                excludeKeys.forEach(key => {
                    delete value[key];
                });
            }
        }

        return _.cloneDeepWith(collection, omitFn);
    }

    __onKeyDown(e) {
        if ((e.metaKey || e.ctrlKey) && (['s', 'Enter'].indexOf(e.key) > -1) && !e.isDefaultPrevented()) {
            // Need to blur current target in case of input fields to trigger validation
            e.target.blur();
            e.preventDefault();
            e.stopPropagation();
            this.submit();
        }
    }
}

FormContainer.defaultProps = {
    defaultModel: {},
    connectToRouter: false,
    createHttpMethod: 'post',
    validateOnFirstSubmit: false,
    onSubmitSuccess: null,
    onFailure: _.noop,
    onProgress(pe) {
        const cmp = <div>Your data is being uploaded...<Ui.Progress value={pe.progress}/></div>;
        Webiny.Growl(<Ui.Growl.Info id={this.growlId} title="Please be patient" sticky={true}>{cmp}</Ui.Growl.Info>);
    },
    injectInto: () => [
        Ui.Form.Loader,
        Ui.Form.Error
    ],
    onSuccessMessage: () => {
        return 'Your record was saved successfully!';
    },
    renderer() {
        return (
            <webiny-form-container onKeyDown={this.__onKeyDown}>{this.__renderContent()}</webiny-form-container>
        );
    }
};

export default FormContainer;
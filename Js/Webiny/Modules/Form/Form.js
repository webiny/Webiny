import Webiny from 'Webiny';
import Validator from './../Validation/Validator';

class Form extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            model: {}
        };

        this.$isValid = null;
        this.fields = [];
        this.actions = [];
        this.layout = null;
        this.watches = {};

        this.bindMethods('submit', 'reset', 'cancel', 'attachToForm', 'attachValidators', 'detachFromForm', 'validateInput', 'validate');
    }

    componentWillMount() {
        super.componentWillMount();
        this.inputs = {};
        this.setState({model: _.clone(this.props.data)});
        if (this.props.container) {
            this.props.container.registerForm(this);
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setState({model: _.clone(props.data)});
    }

    componentWillUpdate(newProps, newState) {
        super.componentWillUpdate(newProps, newState);
    }

    bindTo(name, callback = _.noop) {
        return super.bindTo('model.' + name, callback);
    }

    watch(name, callback) {
        const watches = _.get(this.watches, name, []);
        watches.push(callback);
        _.set(this.watches, name, watches);
    }

    /**
     * @private
     * @param children
     */
    prepareForm(children) {
        if (typeof children !== 'object' || children === null) {
            return;
        }

        React.Children.map(children, child => {
            if (child.type === 'fields') {
                this.fields = this.registerInputs(child.props.children);
            }

            if (child.type === 'actions') {
                this.actions = child.props.children;
            }
        }, this);

        if (this.props.layout === false) {
            this.layout = (
                <layout>
                    <fields/>
                </layout>
            );
        }

        if (this.props.layout) {
            this.layout = this.props.layout.call(this);
        }
    }

    /**
     * @private
     * @param element
     * @returns {*}
     */
    replacePlaceholders(element) {
        if (typeof element !== 'object' || element === null) {
            return element;
        }

        if (element.type === 'fields') {
            return this.fields;
        }

        if (element.type === 'actions') {
            return this.actions;
        }

        if (element.props && element.props.children) {
            return React.cloneElement(element, _.omit(element.props, ['key', 'ref']), React.Children.map(element.props.children, item => {
                return this.replacePlaceholders(item);
            }));
        }

        return element;
    }

    /**
     * @private
     * @param input
     * @returns {*}
     */
    registerInput(input) {
        if (typeof input !== 'object' || input === null) {
            return input;
        }

        const newProps = {
            attachToForm: this.attachToForm,
            attachValidators: this.attachValidators,
            detachFromForm: this.detachFromForm,
            validateInput: this.validateInput,
            form: this
        };

        if (input.props && input.props.name) {
            // Add onChange callback to valueLink
            const name = _.upperFirst(_.camelCase(input.props.name));
            const callback = _.get(this.props, 'onChange' + name, _.noop);

            // Input changed callback, triggered on each input change
            const changeCallback = function inputChanged(newValue) {
                callback.bind(this, newValue);
                // See if there is a watch registered for changed input
                const watches = _.get(this.watches, input.props.name, []);
                _.map(watches, w => w(newValue));
            };

            newProps['valueLink'] = this.bindTo(input.props.name, changeCallback.bind(this));

            // Add input renderer
            if (_.has(this.props, 'render' + name)) {
                newProps.renderer = this.props['render' + name];
            }

            // Add options source
            if (_.has(this.props, 'options' + name)) {
                newProps.options = this.props['options' + name];
            }

            // Add options source
            if (_.has(this.props, 'optionRenderer' + name)) {
                const selectRenderers = this.props['optionRenderer' + name];
                newProps.optionRenderer = selectRenderers.option || null;
                newProps.selectedRenderer = selectRenderers.selected || null;
            }
            return React.cloneElement(input, newProps, input.props && input.props.children);
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

    /**
     * Get data this form is responsible for.
     * Form may receive data through props that is not handled by any of form input elements,
     * so we only return the data handled by form input elements.
     *
     * @returns {{}}
     */
    getModel() {
        const model = {};
        _.each(this.inputs, (input, name) => {
            _.set(model, name, _.get(this.state.model, name));
        });

        return model;
    }

    getLinkedForms() {
        if (this.props.container && this === this.props.container.mainForm) {
            return this.props.container.linkedForms;
        }

        if (!this.props.container && this.props.linkedForms) {
            return _.filter(this.props.linkedForms.split(',')).map(Webiny.Ui.Dispatcher.get);
        }

        return [];
    }

    submit(e) {
        e.preventDefault();
        // Validate main form first
        return this.validate().then(mainFormValid => {
            if (!mainFormValid) {
                console.log("MAIN FORM NOT VALID");
                this.props.onInvalid(this);
                return false;
            }

            // Now proceed to validation of linked forms, if any.
            const model = _.merge({}, this.props.defaultData, this.getModel());

            // Validate linked forms
            const forms = this.getLinkedForms();
            if (forms.length) {
                let valid = true;

                // Forms must be validated in a queue because we may have async validators
                let chain = Q();
                _.each(forms, form => {
                    chain = chain.then(() => {
                        return form.validate().then(formValid => {
                            if (formValid) {
                                _.merge(model, form.getData());
                                return true;
                            }

                            valid = false;
                            form.props.onInvalid(form);
                            return false;
                        });
                    });
                });

                return chain.then(() => {
                    if (valid) {
                        this.props.onSubmit(model, this.props.container);
                        return true;
                    }
                    return false;
                });
            }

            // If no linked forms are present...
            this.props.onSubmit(model, this.props.container);
            return true;
        });
    }

    reset() {
        // Reset all linked forms
        _.each(this.getLinkedForms(), form => form.reset());

        _.forIn(this.inputs, cmp => {
            cmp.component.setState({isValid: null});
        });
        this.$isValid = null;

        this.props.onReset();

        this.setState({model: _.clone(this.props.data)});
    }

    cancel() {
        this.props.onCancel();
    }

    /**
     * Get current form data including data from linked forms
     * @returns {Object|*}
     */
    getData() {
        const model = _.merge({}, this.props.defaultData, this.getModel());
        const forms = this.getLinkedForms();
        if (forms.length) {
            _.each(forms, form => {
                _.merge(model, form.getData());
            });
        }

        return model;
    }

    isValid() {
        return this.$isValid;
    }

    attachValidators(props) {
        this.inputs[props.name].validators = Validator.parseValidateProperty(props.validate);
        this.inputs[props.name].messages = Validator.parseCustomValidationMessages(props.children);
    }

    attachToForm(component) {
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
        return Q(Validator.validate(component.getValue(), validators, this.inputs)).then(() => {
            if (hasValidators) {
                const isValid = component.getValue() === null ? null : true;
                component.setState({isValid});
            }
            return true; //component.getValue();
        }).catch(validationError => {
            // Set custom error message if defined
            const validator = validationError.validator;
            if (validator in messages) {
                validationError.setMessage(messages[validator]);
            }

            // Set component state to reflect validation error
            component.setState({
                isValid: false,
                validationMessage: validationError.message
            });

            return false;
        });
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
                        return this.validateInput(cmp).then(isValid => {
                            if (!isValid) {
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

    render() {
        this.prepareForm(this.props.children);
        return super.render();
    }
}

Form.defaultProps = {
    name: _.uniqueId('form-'),
    onSubmit: _.noop,
    onReset: _.noop,
    onCancel: _.noop,
    onInvalid: _.noop,
    showLoader: true,
    linkedForms: null
};

export default Form;
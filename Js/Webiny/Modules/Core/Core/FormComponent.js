import Component from './Component';

class FormComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isValid: null,
            validationMessage: null,
            validationResults: {}
        };

        this.bindMethods('isRequired', 'validate', 'getValue', 'hasValue', 'onChange', 'isDisabled');
    }

    componentWillMount() {
        super.componentWillMount();
        if (this.props.attachToForm) {
            this.props.attachToForm(this);
        }
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (props.validate !== this.props.validate && this.props.attachValidators) {
            this.props.attachValidators(props);
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.props.detachFromForm) {
            this.props.detachFromForm(this);
        }
    }

    validate() {
        if (this.props.validateInput) {
            return this.props.validateInput(this).then(validationResult => {
                if (this.props.onBlur) {
                    this.props.onBlur.call(null, validationResult, this);
                }
                return validationResult;
            });
        }
        return Q(true);
    }

    isValid() {
        return this.state.isValid !== false;
    }

    hasValue() {
        if (this.props.validate && this.props.validate.indexOf('required') === -1) {
            return true;
        }

        if (_.isNumber(this.props.valueLink.value)) {
            return true;
        }

        return !_.isEmpty(this.props.valueLink.value);
    }

    setInvalid(message) {
        this.setState({isValid: false, validationMessage: message});
    }

    getValue() {
        return this.props.valueLink.value;
    }

    isRequired() {
        return this.props.validate && this.props.validate.indexOf('required') > -1;
    }

    onChange(e) {
        this.props.valueLink.requestChange(e.target.value);
    }

    isDisabled(props = this.props) {
        let disabled = props.disabledBy;
        if (_.isFunction(disabled)) {
            return disabled(props.form.getModel());
        }

        if (_.isString(disabled)) {
            const falsy = disabled.startsWith('!');
            disabled = _.trimStart(disabled, '!');
            const value = !!props.form.getModel(disabled);
            return falsy ? value === false : value === true;
        }

        return this.props.disabled;
    }
}

FormComponent.defaultProps = {
    disabled: null,
    disabledBy: null,
    form: null,
    validate: null,
    valueLink: null,
    hideAnimation: {translateY: 0, opacity: 0, duration: 225},
    showAnimation: {translateY: 50, opacity: 1, duration: 225},
    showValidationMessage: true,
    showValidationIcon: true
};

export default FormComponent;
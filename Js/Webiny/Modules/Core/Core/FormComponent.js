import Webiny from 'Webiny';
import Component from './Component';

class FormComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isValid: null,
            validationMessage: null,
            validationResults: {}
        };

        this.bindMethods(
            'isRequired',
            'validate',
            'reset',
            'getValue',
            'hasValue',
            'isDisabled',
            'renderLabel',
            'renderInfo',
            'renderDescription',
            'renderValidationIcon',
            'renderValidationMessage'
        );
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
            if (!this.isValid()) {
                this.validate();
            }
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

    reset() {
        this.setState({isValid: null});
    }

    hasValue() {
        if (this.props.validate && this.props.validate.indexOf('required') === -1) {
            return true;
        }

        if (_.isNumber(this.props.value)) {
            return true;
        }

        return !_.isEmpty(this.props.value);
    }

    setInvalid(message) {
        this.setState({isValid: false, validationMessage: message});
    }

    getValue(props = null) {
        if (!props) {
            props = this.props;
        }
        return props.value;
    }

    isRequired() {
        return this.props.validate && this.props.validate.indexOf('required') > -1;
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

    getPlaceholder() {
        if (React.isValidElement(this.props.placeholder) && _.get(this.props.placeholder, 'type.name') === 'I18N') {
            const props = this.props.placeholder.props;
            return Webiny.i18n(props.translationKey, props.placeholder, props.variables, props.options);
        }
        return this.props.placeholder;
    }

    renderLabel() {
        return this.props.labelRenderer.call(this);
    }

    renderInfo() {
        return this.props.infoRenderer.call(this);
    }

    renderDescription() {
        return this.props.descriptionRenderer.call(this);
    }

    renderValidationMessage() {
        return this.props.validationMessageRenderer.call(this);
    }

    renderValidationIcon() {
        return this.props.validationIconRenderer.call(this);
    }
}

FormComponent.defaultProps = {
    disabled: false,
    disabledBy: null,
    label: null,
    placeholder: null,
    info: null,
    description: null,
    form: null,
    validate: null,
    value: null,
    onChange: _.noop,
    hideValidationAnimation: {translateY: 0, opacity: 0, duration: 225},
    showValidationAnimation: {translateY: 50, opacity: 1, duration: 225},
    showValidationMessage: true,
    showValidationIcon: true,
    tooltip: null,
    labelRenderer() {
        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if (this.props.tooltip) {
                const Ui = Webiny.Ui.Components;
                tooltip = <Ui.Tooltip key="label" target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
            }

            let required = null;
            if (this.props.validate && this.props.validate.indexOf('required') > -1) {
                required = <span className="mandat">*</span>;
            }

            label = <label key="label" className="control-label">{this.props.label} {required} {tooltip}</label>;
        }

        return label;
    },
    validationMessageRenderer() {
        if (!this.props.showValidationMessage || this.state.isValid !== false) {
            return null;
        }
        return <span className="help-block w-anim">{this.state.validationMessage}</span>;
    },
    validationIconRenderer() {
        if (!this.props.showValidationIcon || this.state.isValid === null) {
            return null;
        }

        if (this.state.isValid === true) {
            return <span className="icon icon-good"/>;
        }
        return <span className="icon icon-bad"/>;
    },
    infoRenderer() {
        let info = this.props.info;
        if (_.isFunction(info)) {
            info = info(this);
        }

        return info ? <span className="info-txt">{info}</span> : null;
    },
    descriptionRenderer() {
        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        return description ? <span className="help-block">{description}</span> : null;
    }
};

export default FormComponent;
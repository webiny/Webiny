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
        return Promise.resolve(true);
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
        if (React.isValidElement(this.props.placeholder) && Webiny.isElementOfType(this.props.placeholder, Webiny.Ui.Components.I18N)) {
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
            label = (
                <Webiny.Ui.LazyLoad modules={['Tooltip', 'Input', 'Icon']}>
                    {({Tooltip, Input, Icon}) => {
                        let tooltip = null;
                        if (this.props.tooltip) {
                            tooltip = <Tooltip key="label" target={<Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Tooltip>;
                        }

                        let required = null;
                        if (this.props.validate && this.props.validate.indexOf('required') > -1) {
                            required = <Input.Mandat/>;
                        }

                        return <Input.Label>{this.props.label} {required} {tooltip}</Input.Label>;
                    }}
                </Webiny.Ui.LazyLoad>
            );
        }

        return label;
    },
    validationMessageRenderer() {
        if (!this.props.showValidationMessage || this.state.isValid !== false) {
            return null;
        }
        return (
            <Webiny.Ui.LazyLoad modules={['Input']}>
                {({Input}) => (
                    <Input.ValidationMessage>{this.state.validationMessage}</Input.ValidationMessage>
                )}
            </Webiny.Ui.LazyLoad>
        );
    },

    infoRenderer() {
        let info = this.props.info;
        if (_.isFunction(info)) {
            info = info(this);
        }

        if (!info) {
            return null;
        }

        return (
            <Webiny.Ui.LazyLoad modules={['Input']}>
                {({Input}) => (
                    <Input.InfoMessage>{info}</Input.InfoMessage>
                )}
            </Webiny.Ui.LazyLoad>
        );
    },
    descriptionRenderer() {
        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        if (!description) {
            return null;
        }

        return (
            <Webiny.Ui.LazyLoad modules={['Input']}>
                {({Input}) => (
                    <Input.DescriptionMessage>{description}</Input.DescriptionMessage>
                )}
            </Webiny.Ui.LazyLoad>
        );
    }
};

export default FormComponent;
import Component from './Component';

class FormComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isValid: null,
            validationMessage: null
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
            this.props.validateInput(this).then(this.props.onBlur || _.noop);
        }
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
            return disabled(props.form.props.container.getData());
        }

        if (_.isString(disabled)) {
            const falsy = _.startsWith(disabled, '!');
            disabled = _.trimStart(disabled, '!');
            const value = !!props.form.props.container.getData(disabled);
            return falsy ? value === false : value === true;
        }

        return this.props.disabled;
    }
}

export default FormComponent;
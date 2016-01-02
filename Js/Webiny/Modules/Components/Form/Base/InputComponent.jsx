import Component from './../../../Core/Core/Component';

class InputComponent extends Component {

    constructor() {
        super();

        this.componentWrapperClass = 'col-xs-11';

        this.state = {
            isValid: null,
            passwordVisible: false
        };

        this.bindMethods('isRequired', 'validate', 'getValue', 'getFormType', 'hasValue', 'getDOM', 'getValidationValues', 'togglePasswordVisibility');
    }

    togglePasswordVisibility() {
        this.setState({passwordVisible: !this.state.passwordVisible})
    }

    componentWillMount() {
        if (this.props.attachToForm) {
            this.props.attachToForm(this);
        }

        if (this.props.componentWrapperClass) {
            this.componentWrapperClass = this.props.componentWrapperClass;
        }
    }


    getComponentWrapperClass() {
        return this.classSet(this.componentWrapperClass);
    }

    componentWillReceiveProps(props) {
        if (props.validate != this.props.validate && this.props.attachValidators) {
            this.props.attachValidators(props);
        }
    }

    shouldComponentUpdate() {
        return true;
    }

    componentWillUnmount() {
        if (this.props.detachFromForm) {
            this.props.detachFromForm(this);
        }
    }

    /**
     * If addon element has a 'name' - create a valueLink using that name
     * @param children
     * @returns {*}
     */
    createAddon(children) {
        return React.Children.map(children, child => {
            if (child && child.props && child.props.name) {
                return React.cloneElement(child, {
                    valueLink: this.props.form.getValueLink(child.props.name),
                    form: this.props.form
                }, children);
            }
            return child;
        });
    }

    validate() {
        if (this.props.validateInput) {
            this.props.validateInput(this).then(this.props.onBlur || _.noop);
        }
    }

    getValue() {
        return this.props.valueLink.value;
    }

    getFormType(defaultType = 'native') {
        if (this.props.context) {
            return this.props.context;
        }
        return this.props.form ? this.props.form.getFormType() : defaultType;
    }

    isRequired() {
        return this.props.validate && this.props.validate.indexOf('required') > -1;
    }

    hasValue() {
        if (this.props.type == 'password' && this.props.validate && this.props.validate.indexOf('required') == -1) {
            return true;
        }
        return !_.isEmpty(this.props.valueLink.value);
    }

    getValidationValues() {
        var validationError = null;

        if (this.state.isValid === false) {
            validationError = <span className="help-block mt5">{this.state.validationError}</span>;
        } else if (this.props.description) {
            validationError =
                <span className="help-block mt5" dangerouslySetInnerHTML={{__html: this.props.description}}></span>;
        }

        if (!this.props.validate) {
            return {validationError: validationError, validationIcon: null, validationClass: ''};
        }

        var iconClass = 'append-icon right';

        var validationIcon = null;
        if (this.state.isValid === true) {
            validationIcon = <span className={iconClass}><i className="demo-icon icon-accept_icon"></i></span>
        }

        if (this.state.isValid === false) {
            validationIcon = <span className={iconClass}><i className="demo-icon icon-error-icon"></i></span>
        }

        var validationClass = '';
        if (this.state.isValid === false) {
            validationClass = 'has-error';
        }

        if (this.state.isValid === true) {
            validationClass = 'has-success';
        }

        if (this.getFormType() == 'horizontal' || !this.props.label) {
            validationClass += ' label-left';
        }

        return {validationError, validationIcon, validationClass};
    }
}

export default InputComponent;
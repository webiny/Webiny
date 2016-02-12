import Webiny from 'Webiny';

class Input extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
    }

    onKeyDown(e) {
        switch (e.key) {
            case 'Enter':
                this.props.onEnter(e);
                break;
            default:
                break;
        }
    }
}

Input.defaultProps = {
    onEnter: _.noop,
    renderer: function renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label key="label" className="control-label">{this.props.label}</label>;
        }

        let validationIcon = null;
        let validationMessage = null;
        if (this.state.isValid === true) {
            validationIcon = <span className="icon icon-good"></span>;
        }

        if (this.state.isValid === false) {
            validationIcon = <span className="icon icon-bad"></span>;
            validationMessage = <span className="info-txt">({this.state.validationMessage})</span>;
        }

        const props = {
            onBlur: this.validate,
            disabled: this.props.disabled,
            readOnly: this.props.readOnly,
            type: this.props.type,
            className: 'form-control',
            valueLink: this.props.valueLink,
            placeholder: this.props.placeholder,
            onKeyUp: this.props.onKeyUp || null,
            onKeyDown: this.props.onKeyDown || this.onKeyDown.bind(this)
        };

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                {validationMessage}
                <input {...props}/>
                {validationIcon}
            </div>
        );
    }
};

export default Input;

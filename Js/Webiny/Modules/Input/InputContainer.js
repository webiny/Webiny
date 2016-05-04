import Webiny from 'Webiny';
import Input from './Input';

class InputContainer extends Webiny.Ui.FormComponent {

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

InputContainer.defaultProps = {
    onEnter: _.noop,
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            label = <label className="control-label">{this.props.label}</label>;
        }

        let validationIcon = null;
        let validationMessage = null;
        if (this.state.isValid === true) {
            validationIcon = <span className="icon icon-good"></span>;
        }

        if (this.state.isValid === false) {
            validationIcon = <span className="icon icon-bad"></span>;
            validationMessage = <span className="help-block">{this.state.validationMessage}</span>;
        }

        const props = {
            onBlur: this.validate,
            disabled: this.isDisabled(),
            readOnly: this.props.readOnly,
            type: this.props.type,
            className: 'form-control',
            valueLink: this.props.valueLink,
            placeholder: this.props.placeholder,
            onKeyUp: this.props.onKeyUp || null,
            onKeyDown: this.props.onKeyDown || this.onKeyDown.bind(this),
            onEnter: this.props.onEnter
        };

        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        return (
            <div className={this.classSet(cssConfig)}>
                {label}
                <Webiny.Ui.Components.DelayedValueLink>
                    <Input {...props}/>
                </Webiny.Ui.Components.DelayedValueLink>
                <span className="help-block">{description}</span>
                {validationMessage}
                {validationIcon}
            </div>
        );
    }
};

export default InputContainer;

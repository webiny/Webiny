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
            onBlur: this.props.validateInput ? this.validate : this.props.onBlur,
            disabled: this.isDisabled(),
            readOnly: this.props.readOnly,
            type: this.props.type,
            className: 'form-control',
            valueLink: this.props.valueLink,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            onKeyUp: this.props.onKeyUp || null,
            onKeyDown: this.props.onKeyDown || this.onKeyDown.bind(this),
            onEnter: this.props.onEnter
        };

        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        return (
            <div className={this.classSet(cssConfig, this.props.className)}>
                {label}
                <div className="input-group">
                    <Webiny.Ui.Components.DelayedValueLink>
                        <Input {...props}/>
                    </Webiny.Ui.Components.DelayedValueLink>
                    {validationIcon}
                </div>
                <span className="help-block">{description}</span>
                {validationMessage}
            </div>
        );
    }
};

export default InputContainer;

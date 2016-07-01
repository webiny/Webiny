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
    delay: 400,
    readOnly: false,
    onEnter: _.noop,
    description: null,
    info: null,
    showValidationIcon: true,
    showValidationMessage: true,
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
        let validationMessage = false;
        if (this.state.isValid === true) {
            validationIcon = <span className="icon icon-good"></span>;
        }

        if (this.state.isValid === false) {
            validationIcon = <span className="icon icon-bad"></span>;
            validationMessage = <span className="help-block w-anim">{this.state.validationMessage}</span>;
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

        let info = this.props.info;
        if (_.isFunction(info)) {
            info = info(this);
        }

        return (
            <div className={this.classSet(cssConfig, this.props.className)}>
                {label}
                <span className="info-text">{info}</span>
                <div className="input-group">
                    <Webiny.Ui.Components.DelayedValueLink delay={this.props.delay}>
                        <Input {...props}/>
                    </Webiny.Ui.Components.DelayedValueLink>
                    {this.props.showValidationIcon ? validationIcon : null}
                </div>
                <span className="help-block">{description}</span>
                <Webiny.Ui.Components.Animate
                    trigger={validationMessage}
                    show={{translateY: 50, opacity: 1, duration: 225}}
                    hide={{translateY: -50, opacity: 0, duration: 225}}>
                    {this.props.showValidationMessage ? validationMessage : null}
                </Webiny.Ui.Components.Animate>
            </div>
        );
    }
};

export default InputContainer;

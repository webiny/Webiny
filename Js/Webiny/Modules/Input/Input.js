import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Input extends Webiny.Ui.FormComponent {

    onKeyDown(e) {
        if (e.metaKey || e.ctrlKey) {
            return;
        }

        switch (e.key) {
            case 'Enter':
                if (this.props.onEnter && this.props.onEnter !== _.noop) {
                    e.preventDefault();
                    this.props.onEnter(e);
                }
                break;
            default:
                break;
        }
    }
}

Input.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    delay: 400,
    description: null,
    info: null,
    label: null,
    name: null,
    onEnter: _.noop,
    onKeyDown: _.noop,
    onKeyUp: _.noop,
    placeholder: null,
    readOnly: false,
    tooltip: null,
    type: 'text',
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if (this.props.tooltip) {
                tooltip = <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
            }
            label = <label className="control-label">{this.props.label} {tooltip}</label>;
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
            value: this.getValue() || '',
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            onKeyUp: this.props.onKeyUp,
            onKeyDown: this.props.onKeyDown !== _.noop ? this.props.onKeyDown : this.onKeyDown.bind(this),
            onChange: this.props.onChange
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
                <span className="info-txt">{info}</span>

                <div className="input-group">
                    <Webiny.Ui.Components.DelayedOnChange>
                        <input {...props}/>
                    </Webiny.Ui.Components.DelayedOnChange>
                    {this.props.showValidationIcon ? validationIcon : null}
                </div>
                <span className="help-block">{description}</span>
                <Webiny.Ui.Components.Animate
                    trigger={validationMessage}
                    show={this.props.showValidationAnimation}
                    hide={this.props.hideValidationAnimation}>
                    {this.props.showValidationMessage ? validationMessage : null}
                </Webiny.Ui.Components.Animate>
            </div>
        );
    }
});

export default Input;

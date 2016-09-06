import Webiny from 'Webiny';
import Input from './Input';
const Ui = Webiny.Ui.Components;

class InputContainer extends Webiny.Ui.FormComponent {

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

InputContainer.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    delay: 400,
    description: null,
    info: null,
    label: null,
    name: null,
    onEnter: _.noop,
    onKeyDown: _.noop,
    onKeyUp: _.noop,
    onChange: _.noop,
    placeholder: null,
    readOnly: false,
    tooltip: null,
    type: 'text',
    value: null,
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
            value: this.props.value || null,
            valueLink: this.props.valueLink,
            placeholder: _.get(this.props.placeholder, 'props.children', this.props.placeholder),
            onKeyUp: this.props.onKeyUp,
            onKeyDown: this.props.onKeyDown !== _.noop ? this.props.onKeyDown : this.onKeyDown.bind(this),
            onEnter: this.props.onEnter,
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

        if (!props.valueLink) {
            delete props['valueLink'];
        }

        let input = <Input {...props}/>;
        if (props.valueLink) {
            input = <Webiny.Ui.Components.DelayedValueLink>{input}</Webiny.Ui.Components.DelayedValueLink>;
        }

        return (
            <div className={this.classSet(cssConfig, this.props.className)}>
                {label}
                <span className="info-txt">{info}</span>

                <div className="input-group">
                    {input}
                    {this.props.showValidationIcon ? validationIcon : null}
                </div>
                <span className="help-block">{description}</span>
                <Webiny.Ui.Components.Animate
                    trigger={validationMessage}
                    show={this.props.showAnimation}
                    hide={this.props.hideAnimation}>
                    {this.props.showValidationMessage ? validationMessage : null}
                </Webiny.Ui.Components.Animate>
            </div>
        );
    }
});

export default InputContainer;

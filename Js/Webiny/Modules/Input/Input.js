import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Input extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.bindMethods('focus');
    }

    onKeyDown(e) {
        if (e.metaKey || e.ctrlKey) {
            return;
        }

        switch (e.key) {
            case 'Enter':
                if (this.props.onEnter && this.props.onEnter !== _.noop) {
                    e.preventDefault();
                    this.props.onEnter(e, this);
                }
                break;
            default:
                break;
        }
    }

    focus() {
        ReactDOM.findDOMNode(this).querySelector('input').focus();
    }
}

Input.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    delay: 400,
    name: null,
    onEnter: _.noop, // NOTE: only works if inside a Form
    onKeyDown: _.noop,
    onKeyUp: _.noop,
    placeholder: null,
    readOnly: false,
    type: 'text',
    autoFocus: null,
    addonLeft: null,
    addonRight: null,
    iconLeft: null,
    iconRight: null,
    wrapperClassName: '',
    renderer() {
        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        const props = {
            'data-on-enter': this.props.onEnter !== _.noop,
            onBlur: this.props.validateInput ? this.validate : this.props.onBlur,
            disabled: this.isDisabled(),
            readOnly: this.props.readOnly,
            type: this.props.type,
            className: 'form-control',
            value: this.getValue() || '',
            placeholder: this.getPlaceholder(),
            onKeyUp: this.props.onKeyUp,
            onKeyDown: this.props.onKeyDown !== _.noop ? this.props.onKeyDown : this.onKeyDown.bind(this),
            onChange: this.props.onChange,
            autoFocus: this.props.autoFocus
        };

        let addonLeft = '';
        if (this.props.addonLeft) {
            addonLeft = (<span className="input-group-addon">{this.props.addonLeft}</span>);
        }

        let addonRight = '';
        if (this.props.addonRight) {
            addonRight = (<span className="input-group-addon">{this.props.addonRight}</span>);
        }

        let wrapperClassName = this.props.wrapperClassName + ' input-group';
        let iconLeft = '';
        if (this.props.iconLeft) {
            wrapperClassName += ' icon-left';
            iconLeft = (<span className={this.props.iconLeft}></span>);
        }

        let iconRight = '';
        if (this.props.iconRight) {
            wrapperClassName += ' icon-right';
            iconRight = (<span className={this.props.iconRight}></span>);
        }

        return (
            <div className={this.classSet(cssConfig, this.props.className)}>
                {this.renderLabel()}
                {this.renderInfo()}

                <div className={wrapperClassName}>
                    {iconLeft}
                    {addonLeft}
                    <Webiny.Ui.Components.DelayedOnChange delay={this.props.delay}>
                        <input {...props}/>
                    </Webiny.Ui.Components.DelayedOnChange>
                    {addonRight}
                    {iconRight}
                    {this.renderValidationIcon()}
                </div>
                {this.renderDescription()}
                <Webiny.Ui.Components.Animate
                    trigger={this.renderValidationMessage()}
                    show={this.props.showValidationAnimation}
                    hide={this.props.hideValidationAnimation}>
                    {this.renderValidationMessage()}
                </Webiny.Ui.Components.Animate>
            </div>
        );
    }
});

export default Input;

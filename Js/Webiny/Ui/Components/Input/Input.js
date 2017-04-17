import Webiny from 'Webiny';
import ValidationIcon from './Components/ValidationIcon';
import styles from './styles/Input.css';

class Input extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.bindMethods('focus,renderValidationIcon');
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

    renderValidationIcon() {
        return this.props.validationIconRenderer.call(this);
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
    validationIconRenderer() {
        if (!this.props.showValidationIcon || this.state.isValid === null) {
            return null;
        }

        if (this.state.isValid === true) {
            //return <span className="icon icon-good"/>;
            return <ValidationIcon/>;
        }
        //return <span className="icon icon-bad"/>;
        return <ValidationIcon success={false}/>;
    },
    renderer() {
        const {styles} = this.props;
        const cssConfig = this.classSet(
            styles.wrapper,
            (this.state.isValid === false && styles.error),
            (this.state.isValid === true && styles.success)
        );

        const props = {
            'data-on-enter': this.props.onEnter !== _.noop,
            onBlur: this.props.validateInput ? this.validate : this.props.onBlur,
            disabled: this.isDisabled(),
            readOnly: this.props.readOnly,
            type: this.props.type,
            className: styles.input,
            value: this.getValue() || '',
            placeholder: this.getPlaceholder(),
            onKeyUp: this.props.onKeyUp,
            onKeyDown: this.props.onKeyDown !== _.noop ? this.props.onKeyDown : this.onKeyDown.bind(this),
            onChange: this.props.onChange,
            autoFocus: this.props.autoFocus
        };

        let showValidationIcon = true;
        let addonLeft = '';
        if (this.props.addonLeft) {
            addonLeft = <span className={styles.addon}>{this.props.addonLeft}</span>;
            showValidationIcon = false;
        }

        let addonRight = '';
        if (this.props.addonRight) {
            addonRight = <span className={styles.addon}>{this.props.addonRight}</span>;
            showValidationIcon = false;
        }

        let wrapperClassName = this.props.wrapperClassName + ' ' + styles.inputGroup;
        let iconLeft = '';
        if (this.props.iconLeft) {
            wrapperClassName += ' ' + styles.iconLeft;
            iconLeft = <span className={this.props.iconLeft}/>;
        }

        let iconRight = '';
        if (this.props.iconRight) {
            wrapperClassName += ' ' + styles.iconRight;
            iconRight = <span className={this.props.iconRight}/>;
        }

        const {DelayedOnChange, Animate} = this.props;

        return (
            <div className={this.classSet(cssConfig, this.props.className)}>
                {this.renderLabel()}
                {this.renderInfo()}

                <div className={wrapperClassName}>
                    {iconLeft}
                    {addonLeft}
                    <DelayedOnChange delay={this.props.delay}>
                        <input {...props}/>
                    </DelayedOnChange>
                    {addonRight}
                    {iconRight}
                    {showValidationIcon && this.renderValidationIcon()}
                </div>
                {this.renderDescription()}
                <Animate
                    trigger={this.renderValidationMessage()}
                    show={this.props.showValidationAnimation}
                    hide={this.props.hideValidationAnimation}>
                    {this.renderValidationMessage()}
                </Animate>
            </div>
        );
    }
});

export default Webiny.createComponent(Input, {modules: ['Animate', 'DelayedOnChange'], styles});

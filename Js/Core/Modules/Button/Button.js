import Webiny from 'Webiny';
import styles from './styles/Button.css';

class Button extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.state = {
            enabled: true
        };
    }

    disable() {
        this.setState({enabled: false});
    }

    enable() {
        this.setState({enabled: true});
    }
}

Button.defaultProps = {
    size: 'normal',
    type: 'default',
    align: 'normal',
    icon: null,
    className: null,
    style: null,
    label: null,
    onClick: _.noop,
    tooltip: null,
    renderer() {
        const props = _.clone(this.props);

        if (props.disabled || !this.state.enabled) {
            props['disabled'] = true;
        }

        const sizeClasses = {
            normal: '',
            large: styles.btnLarge,
            //small: 'btn-sm' // sven: this option doesn't exist in css
        };

        const alignClasses = {
            normal: '',
            left: 'pull-left',
            right: 'pull-right'
        };

        const typeClasses = {
            default: styles.btnDefault,
            primary: styles.btnPrimary,
            secondary: styles.btnSuccess
        };

        const classes = this.classSet(
            sizeClasses[props.size],
            alignClasses[props.align],
            typeClasses[props.type],
            props.className
        );

        const icon = this.props.icon ? <Webiny.Ui.Components.Icon icon={this.props.icon} className={styles.icon + ' ' + styles.iconRight}/> : null;
        let content = props.children || props.label;
        if (icon) {
            content = <span>{content}</span>;
        }

        let button = <button {..._.pick(props, ['style', 'onClick', 'disabled'])} type="button" className={classes}>{icon} {content}</button>;

        if (this.props.tooltip) {
            const Ui = Webiny.Ui.Components;
            button = <Ui.Tooltip target={button} placement="top">{this.props.tooltip}</Ui.Tooltip>;
        }

        return button;
    }
};

export default Webiny.createComponent(Button, {styles});

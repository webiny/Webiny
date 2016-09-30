import Webiny from 'Webiny';

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
    label: null,
    renderer() {
        const props = _.clone(this.props);

        if (!this.state.enabled) {
            props['disabled'] = true;
        }

        const sizeClasses = {
            normal: '',
            large: 'btn-lg',
            small: 'btn-sm'
        };

        const alignClasses = {
            normal: '',
            left: 'pull-left',
            right: 'pull-right'
        };

        const typeClasses = {
            default: 'btn-default',
            primary: 'btn-primary',
            secondary: 'btn-success'
        };

        const classes = this.classSet(
            'btn',
            sizeClasses[props.size],
            alignClasses[props.align],
            typeClasses[props.type],
            props.className
        );

        const icon = this.props.icon ? <Webiny.Ui.Components.Icon icon={this.props.icon} className="right"/> : null;
        let content = props.children || props.label;
        if (icon) {
            content = <span>{content}</span>;
        }
        return <button {..._.omit(props, ['align', 'renderer'])} type="button" className={classes}>{icon} {content}</button>;
    }
};

export default Button;

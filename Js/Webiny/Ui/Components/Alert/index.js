import Webiny from 'Webiny';

class Alert extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
    }
}

Alert.defaultProps = {
    type: 'info',
    icon: 'info',
    title: null,
    close: false,
    renderer() {
        const props = _.clone(this.props);

        const typeClasses = {
            info: 'alert-info',
            success: 'alert-success',
            warning: 'alert-warning',
            error: 'alert-error',
            danger: 'alert-error'
        };

        const iconClasses = {
            info: 'icon-info',
            success: 'icon-check-circle-o',
            warning: 'icon-exclamation-circle',
            error: 'icon-cancel',
            danger: 'icon-cancel'
        };

        const classes = this.classSet(
            'alert',
            typeClasses[props.type],
            props.className
        );

        const Icon = this.props.Icon;
        const icon = this.props.icon ? <Icon icon={iconClasses[props.type]}/> : null;
        let close = null;
        if (props.close) {
            close = (
                <button type="button" className="close" data-dismiss="alert">
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Close</span>
                </button>
            );
        }

        const title = this.props.title ? <strong>{_.trimEnd(this.props.title, ':')}:</strong> : null;

        return (
            <div className={classes}>
                {icon}
                {close}
                {title} {props.children}
            </div>
        );
    }
};

export default Webiny.createComponent(Alert, {modules: ['Icon']});

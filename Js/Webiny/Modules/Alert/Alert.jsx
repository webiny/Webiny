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
            error: 'alert-error'
        };

        const iconClasses = {
            info: 'icon-info',
            success: 'icon-check-circle-o',
            warning: 'icon-exclamation-circle',
            error: 'icon-cancel'
        };

        const classes = this.classSet(
            'alert',
            typeClasses[props.type],
            props.className
        );

        const icon = this.props.icon ? <Webiny.Ui.Components.Icon icon={iconClasses[props.type]}/> : null;
        let close = null;
        if (props.close) {
            close = (
                <button type="button" className="close" data-dismiss="alert">
                    <span aria-hidden="true">×</span>
                    <span className="sr-only">Close</span>
                </button>
            );
        }

        const content = props.children;

        const title = this.props.title ? <strong>{this.props.title}:</strong> : null;

        return (
            <div className={classes}>
                {icon}
                {close}
                {title} {content}
            </div>
        );
    }
};

export default Alert;

import Webiny from 'Webiny';

class Label extends Webiny.Ui.Component {

}

Label.defaultProps = {
    type: 'default',
    renderer() {
        const props = _.clone(this.props);

        const typeClasses = {
            default: 'label-default',
            info: 'label-info',
            primary: 'label-primary',
            success: 'label-success',
            warning: 'label-warning',
            error: 'label-danger'
        };

        const classes = this.classSet(
            'label',
            typeClasses[props.type],
            props.className
        );

        return (
            <span className={classes}>
                {props.children}
            </span>
        );
    }
};

export default Label;

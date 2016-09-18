import Webiny from 'Webiny';

class Label extends Webiny.Ui.Component {

}

Label.defaultProps = {
    inline: false,
    type: 'default',
    style: {},
    className: null,
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

        const styles = _.clone(this.props.style);
        if (this.props.inline) {
            styles['float'] = 'none';
        }

        return (
            <span className={classes} style={styles}>
                {props.children}
            </span>
        );
    }
};

export default Label;

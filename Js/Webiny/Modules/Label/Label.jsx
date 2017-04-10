import Webiny from 'Webiny';
import styles from './styles/Label.css';

class Label extends Webiny.Ui.Component {

}

Label.defaultProps = {
    inline: false,
    type: 'default',
    style: null,
    className: null,
    renderer() {
        const props = _.clone(this.props);

        const typeClasses = {
            default: styles.default,
            info: styles.info,
            primary: styles.primary,
            success: styles.success,
            warning: styles.warning,
            error: styles.danger
        };

        const classes = this.classSet(
            styles.label,
            typeClasses[props.type],
            props.className
        );

        const style = _.clone(this.props.style || {});
        if (this.props.inline) {
            style['float'] = 'none';
        }

        return (
            <span className={classes} style={style}>
                {props.children}
            </span>
        );
    }
};

export default Webiny.createComponent(Label, {styles});

import Webiny from 'Webiny';
import styles from './styles.css';

class Alert extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('close');
    }

    close(){
        ReactDOM.findDOMNode(this).remove();
    }
}

Alert.defaultProps = {
    type: 'info',
    icon: 'info',
    title: null,
    close: false,
    className: null,
    renderer() {
        const props = _.clone(this.props);
        const {styles, type, Icon} = this.props;

        const typeClasses = {
            info: styles.alertInfo,
            success: styles.alertSuccess,
            warning: styles.alertWarning,
            error: styles.alertDanger,
            danger: styles.alertDanger
        };

        const iconClasses = {
            info: 'icon-info-circle',
            success: 'icon-check-circle-o',
            warning: 'icon-exclamation-circle',
            error: 'icon-cancel',
            danger: 'icon-cancel'
        };

        const classes = this.classSet(
            typeClasses[type],
            props.className
        );

        const icon = this.props.icon ? <Icon icon={iconClasses[type]}/> : null;
        let close = null;
        if (props.close) {
            close = (
                <button type="button" className={styles.close} onClick={this.close}>
                    <span aria-hidden="true">×</span>
                </button>
            );
        }

        const title = props.title ? <strong>{_.trimEnd(props.title, ':')}:</strong> : null;

        return (
            <div className={classes}>
                {icon}
                {close}
                {title} {props.children}
            </div>
        );
    }
};

export default Webiny.createComponent(Alert, {styles, modules: ['Icon']});
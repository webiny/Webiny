import Webiny from 'Webiny';
import styles from './styles/Alert.css';

class Alert extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('close');
    }

    close(){
        const domNode = ReactDOM.findDOMNode(this);
        domNode.remove();
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

        const typeClasses = {
            info: styles.alertInfo,
            success: styles.alertSuccess,
            warning: styles.alertWarning,
            error: styles.alertDanger,
            danger: styles.alertDanger
        };

        const iconClasses = {
            info: 'icon-info',
            success: 'icon-check-circle-o',
            warning: 'icon-exclamation-circle',
            error: 'icon-cancel',
            danger: 'icon-cancel'
        };

        const classes = this.classSet(
            typeClasses[props.type],
            props.className
        );
        
        const icon = this.props.icon ? <Webiny.Ui.Components.Icon icon={iconClasses[props.type]}/> : null;
        let close = null;
        if (props.close) {
            close = (
                <button type="button" className={styles.close} onClick={this.close}>
                    <span aria-hidden="true">×</span>
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

export default Webiny.createComponent(Alert, {styles});
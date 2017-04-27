import Webiny from 'Webiny';
import styles from './../styles.css';

class ValidationMessage extends Webiny.Ui.Component {

}

ValidationMessage.defaultProps = {
    success: true,
    renderer() {
        let css = null;
        if (this.props.success === false) {
            css = styles.validationMessageError;
        }

        return <span className={this.classSet(styles.validationMessage, css)}>{this.props.children}</span>;
    }
};

export default Webiny.createComponent(ValidationMessage, {modules: ['Animate'], styles});
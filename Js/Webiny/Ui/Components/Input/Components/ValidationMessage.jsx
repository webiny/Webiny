import Webiny from 'Webiny';
import styles from '../styles.css';

class ValidationMessage extends Webiny.Ui.Component {

}

ValidationMessage.defaultProps = {
    renderer() {
        return <span className={this.classSet(styles.message, styles.validationMessage)}>{this.props.children}</span>;
    }
};

export default ValidationMessage;
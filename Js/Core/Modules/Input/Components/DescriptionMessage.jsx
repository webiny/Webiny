import Webiny from 'Webiny';
import styles from '../styles/Input.css';

class DescriptionMessage extends Webiny.Ui.Component {

}

DescriptionMessage.defaultProps = {
    renderer() {
        return <span className={styles.descriptionMessage}>{this.props.children}</span>;
    }
};

export default DescriptionMessage;
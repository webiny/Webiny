import Webiny from 'Webiny';
import styles from '../styles/Input.css';

class InfoMessage extends Webiny.Ui.Component {

}

InfoMessage.defaultProps = {
    renderer() {
        return <span className={styles.message}>{this.props.children}</span>;
    }
};

export default InfoMessage;
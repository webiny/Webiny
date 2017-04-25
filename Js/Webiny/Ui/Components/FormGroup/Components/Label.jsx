import Webiny from 'Webiny';
import styles from './../styles.css';

class Label extends Webiny.Ui.Component {

}

Label.defaultProps = {
    renderer() {
        return <label className={styles.label}>{this.props.children}</label>;
    }
};

export default Label;
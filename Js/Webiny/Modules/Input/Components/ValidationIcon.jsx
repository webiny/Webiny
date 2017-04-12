import Webiny from 'Webiny';
import styles from '../styles/Input.css';

class ValidationIcon extends Webiny.Ui.Component {

}

ValidationIcon.defaultProps = {
    success: true,
    renderer() {

        let css = styles.validationIconSuccess;
        if (this.props.success === false) {
            css = styles.validationIconError;
        }

        return <span className={css}/>;
    }
};

export default ValidationIcon;
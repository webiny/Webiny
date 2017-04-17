import Webiny from 'Webiny';
import styles from './styles.css';

class Divider extends Webiny.Ui.Component {

}

Divider.defaultProps = {
    renderer() {
        return <li role="presentation" className={styles.divider}/>;
    }
};

export default Webiny.createComponent(Divider, {styles});

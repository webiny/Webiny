import Webiny from 'Webiny';
import styles from './styles.css';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    renderer() {
        const {title, styles} = this.props;
        return <li role="presentation" className={styles.header}>{title}</li>;
    }
};

export default Webiny.createComponent(Header, {styles});

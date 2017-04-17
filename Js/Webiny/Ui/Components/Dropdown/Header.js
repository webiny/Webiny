import Webiny from 'Webiny';
import styles from './styles.css';

class Header extends Webiny.Ui.Component {

}

Header.defaultProps = {
    renderer() {
        const props = _.clone(this.props);
        return <li role="presentation" className={styles.header}>{props.title}</li>;
    }
};

export default Webiny.createComponent(Header, {styles});

import Growl from './Growl';
import styles from './styles/Growl.css';

class DangerGrowl extends Growl {

}

DangerGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: styles.danger
});

export default DangerGrowl;
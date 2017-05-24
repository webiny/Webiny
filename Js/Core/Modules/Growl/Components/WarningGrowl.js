import Growl from './Growl';
import styles from './styles/Growl.css';

class WarningGrowl extends Growl {

}

WarningGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: styles.warning
});

export default WarningGrowl;
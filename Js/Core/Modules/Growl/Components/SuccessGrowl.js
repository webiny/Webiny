import Growl from './Growl';
import styles from './styles/Growl.css';

class SuccessGrowl extends Growl {

}

SuccessGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: styles.success
});

export default SuccessGrowl;
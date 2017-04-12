import Growl from './Growl';
import styles from './styles/Growl.css';

class InfoGrowl extends Growl {

}

InfoGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: styles.info
});

export default InfoGrowl;
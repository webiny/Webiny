import Webiny from 'Webiny';
import Growl from './Growl';
import styles from './styles/Growl.css';

class SuccessGrowl extends Growl {

}

SuccessGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])} className={this.props.styles.success}/>
        );
    }
};

export default Webiny.createComponent(SuccessGrowl, {styles});
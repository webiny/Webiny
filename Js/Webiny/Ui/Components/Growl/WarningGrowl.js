import Webiny from 'Webiny';
import Growl from './Growl';
import styles from './styles/Growl.css';

class WarningGrowl extends Growl {

}

WarningGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])} className={this.props.styles.warning}/>
        );
    }
};

export default Webiny.createComponent(WarningGrowl, {styles});
import Webiny from 'Webiny';
import Growl from './Growl';
import styles from './styles/Growl.css';

class DangerGrowl extends Webiny.Ui.Component {

}

DangerGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])} className={this.props.styles.danger}/>
        );
    }
};

export default Webiny.createComponent(DangerGrowl, {styles});
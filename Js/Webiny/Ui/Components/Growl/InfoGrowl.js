import Webiny from 'Webiny';
import Growl from './Growl';

class InfoGrowl extends Webiny.Ui.Component {

}

InfoGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])}/>
        );
    }
};

export default Webiny.createComponent(InfoGrowl);
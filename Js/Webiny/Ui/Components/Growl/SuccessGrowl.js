import Webiny from 'Webiny';
import Growl from './Growl';

class SuccessGrowl extends Growl {

}

SuccessGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    type: 'success',
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])}/>
        );
    }
};

export default Webiny.createComponent(SuccessGrowl);
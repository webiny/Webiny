import Growl from './Growl';

class DangerGrowl extends Growl {

}

DangerGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: 'danger'
});

export default DangerGrowl;
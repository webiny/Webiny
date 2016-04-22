import Growl from './Growl';

class SuccessGrowl extends Growl {

}

SuccessGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: 'success'
});

export default SuccessGrowl;
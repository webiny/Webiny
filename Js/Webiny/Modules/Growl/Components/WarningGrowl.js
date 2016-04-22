import Growl from './Growl';

class WarningGrowl extends Growl {

}

WarningGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: 'warning'
});

export default WarningGrowl;
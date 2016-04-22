import Growl from './Growl';

class InfoGrowl extends Growl {

}

InfoGrowl.defaultProps = _.assign({}, Growl.defaultProps, {
    className: 'info'
});

export default InfoGrowl;
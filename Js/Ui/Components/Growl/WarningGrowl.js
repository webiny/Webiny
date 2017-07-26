import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import Growl from './Growl';

class WarningGrowl extends Growl {

}

WarningGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    type: 'warning',
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])}/>
        );
    }
};

export default Webiny.createComponent(WarningGrowl);
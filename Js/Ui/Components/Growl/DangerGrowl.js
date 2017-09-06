import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import Growl from './Growl';

class DangerGrowl extends Growl {

}

DangerGrowl.defaultProps = {
    title: null,
    ttl: 3000,
    sticky: false,
    message: null,
    type: 'danger',
    renderer() {
        return (
            <Growl {..._.omit(this.props, ['renderer'])}/>
        );
    }
};

export default Webiny.createComponent(DangerGrowl);
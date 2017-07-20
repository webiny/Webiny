import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';
import Growl from './Growl';

class DangerGrowl extends Webiny.Ui.Component {

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
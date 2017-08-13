import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

class Updates extends Webiny.Ui.View {
    constructor(props) {
        super(props);

    }

}

Dashboard.defaultProps = {
    renderer() {

        const {Gravatar, Button, Link, Icon} = this.props;

        return (

        );
    }
};

export default Webiny.createComponent(Dashboard, {
    modules: ['Gravatar', 'Button', 'Link', 'Icon']
});
import React from 'react';
import Webiny from 'Webiny';

class Footer extends Webiny.Ui.Component {

}

Footer.defaultProps = {
    renderer() {
        return (
            <tfoot>
            <tr/>
            </tfoot>
        );
    }
};

export default Footer;
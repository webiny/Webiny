import React from 'react';
import Webiny from 'Webiny';

class Forbidden extends Webiny.Ui.View {

}

Forbidden.defaultProps = {
    renderer() {
        const {Icon, View} = this.props;
        return (
            <View.List>
                <View.Body>
                    <h3><Icon icon="icon-cancel"/>Access Forbidden</h3>

                    <p>
                        Unfortunately, you are not allowed to see this page.<br/>
                        If you think this is a mistake, please contact your system administrator.
                    </p>
                </View.Body>
            </View.List>
        );
    }
};

export default Webiny.createComponent(Forbidden, {modules: ['Icon', 'View']});
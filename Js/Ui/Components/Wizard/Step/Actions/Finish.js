import React from 'react';
import Webiny from 'webiny';
import _ from 'lodash';

/**
 * @i18n.namespace Webiny.Ui.Wizard.Actions.Previous
 */
class Finish extends Webiny.Ui.Component {
}

// Also receives all standard Button component props
Finish.defaultProps = {
    wizard: null,
    label: Webiny.I18n('Finish'),
    renderer() {
        if (this.props.wizard.isLastStep()) {
            return null;
        }

        const Button = this.props.Button;
        return (
            <Button
                type="primary"
                onClick={_.isFunction(this.props.onClick) ? this.props.onClick : this.props.wizard.finish}
                label={this.props.label}
                align="right"/>
        );
    }
};

export default Webiny.createComponent(Finish, {modules: ['Button']});
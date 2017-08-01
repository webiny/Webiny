import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class Field extends Webiny.Ui.Component {

}

Field.defaultProps = {
    className: null,
    onClick: _.noop,
    width: null,
    renderer() {
        const className = this.classSet(this.props.className, 'expandable-list__row__fields__field flex-cell flex-width-' + this.props.width);

        return (
            <div className={className} onClick={this.props.onClick}>{this.props.children}</div>
        );
    }
};

export default Field;
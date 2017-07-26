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
        let content = this.props.children;
        if (_.isFunction(this.props.children)) {
            content = this.props.children.call(this, this.props.data, this);
        }

        let className = _.union([], [this.props.className]).join(' ');

        return (
            <div className={className + ' expandable-list__row__fields__field flex-cell flex-width-' + this.props.width} onClick={this.props.onClick}>{content}</div>
        );
    }
};

export default Field;
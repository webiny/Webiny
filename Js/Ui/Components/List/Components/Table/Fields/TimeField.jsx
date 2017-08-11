import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class TimeField extends Webiny.Ui.Component {

}

TimeField.defaultProps = {
    format: 'HH:mm',
    renderer() {
        const {List, moment, data, name, format, ...props} = this.props;
        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => moment(_.get(data, name)).format(format)}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(TimeField, {modules: ['List', {moment: 'Webiny/Vendors/Moment'}], tableField: true});
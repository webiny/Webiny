import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import moment from 'moment';

class TimeField extends Webiny.Ui.Component {

}

TimeField.defaultProps = {
    format: 'HH:mm',
    renderer() {
        const {List, ...props} = this.props;
        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => moment(_.get(this.props.data, this.props.name)).format(this.props.format)}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(TimeField, {modules: ['List'], tableField: true});
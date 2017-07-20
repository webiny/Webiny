import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';
import moment from 'moment';

class TimeAgoField extends Webiny.Ui.Component {

}

TimeAgoField.defaultProps = {
    renderer() {
        let value = this.props.data[this.props.name];
        if (value) {
            value = moment(value).fromNow();
        }

        const {List, ...props} = this.props;

        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => value || this.props.default}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(TimeAgoField, {modules: ['List'], tableField: true});
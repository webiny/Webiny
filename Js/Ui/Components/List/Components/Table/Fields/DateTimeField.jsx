import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import moment from 'moment';

class DateTimeField extends Webiny.Ui.Component {

}

DateTimeField.defaultProps = {
    format: 'YYYY-MM-DD HH:mm',
    renderer() {
        const datetime = moment(_.get(this.props.data, this.props.name), moment.ISO_8601);
        const {List, ...props} = this.props;

        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => datetime.isValid() ? datetime.format(this.props.format) : this.props.default}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(DateTimeField, {modules: ['List'], tableField: true});
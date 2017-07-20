import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';
import moment from 'moment';

class DateField extends Webiny.Ui.Component {

}

DateField.defaultProps = {
    default: '-',
    format: 'YYYY-MM-DD',
    renderer() {
        const date = moment(_.get(this.props.data, this.props.name));
        const {List, format, ...props} = this.props;

        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => date.isValid() ? date.format(format) : this.props.default}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(DateField, {modules: ['List'], tableField: true});
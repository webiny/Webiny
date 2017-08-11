import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class DateTimeField extends Webiny.Ui.Component {

}

DateTimeField.defaultProps = {
    format: 'YYYY-MM-DD HH:mm',
    renderer() {
        const {List, moment, ...props} = this.props;
        const datetime = moment(_.get(this.props.data, this.props.name), moment.ISO_8601);

        return (
            <List.Table.Field {..._.omit(props, ['renderer'])}>
                {() => datetime.isValid() ? datetime.format(this.props.format) : this.props.default}
            </List.Table.Field>
        );
    }
};

export default Webiny.createComponent(DateTimeField, {modules: ['List', {moment: 'Webiny/Vendors/Moment'}], tableField: true});
import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class Email extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('focus');
    }

    focus() {
        this.refs.input.focus();
    }
}

Email.defaultProps = {
    renderer() {
        const props = _.omit(this.props, ['renderer', 'Input']);
        if (props.onChange) {
            props.onChange = (value, cb) => {
                return this.props.onChange(value ? value.toLowerCase().trim() : value, cb);
            };
        }

        const validate = _.get(props, 'validate');
        props.validate = validate ? validate + ',email' : 'email';

        const {Input} = this.props;
        return (
            <Input ref="input" {...props}/>
        );
    }
};

export default Webiny.createComponent(Email, {modules: ['Input']});

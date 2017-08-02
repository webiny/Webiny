import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class Password extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
            icon: 'fa-eye',
            msg: 'Show content'
        };

        this.bindMethods('togglePassword');
    }

    togglePassword() {
        if (this.state.showPassword === true) {
            this.setState({
                showPassword: false,
                icon: 'fa-eye',
                msg: 'Show content'
            });
        } else {
            this.setState({
                showPassword: true,
                icon: 'fa-eye-slash',
                msg: 'Hide content'
            });
        }
    }
}

Password.defaultProps = {
    renderer() {
        const props = _.omit(this.props, ['renderer']);
        const {Icon, Input, Link} = props;
        props.info = <Link tabIndex="-1" onClick={this.togglePassword}><Icon icon={this.state.icon}/> {this.state.msg}</Link>;
        props.type = this.state.showPassword ? 'text' : 'password';
        const validate = 'password';
        props.validate = _.get(props, 'validate.length') ? props.validate + ',' + validate : validate;

        return (
            <Input {...props}/>
        );
    }
};

export default Webiny.createComponent(Password, {modules: ['Link', 'Icon', 'Input']});

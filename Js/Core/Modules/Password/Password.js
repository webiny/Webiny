import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

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
        props.info = <Ui.Link tabIndex="-1" onClick={this.togglePassword}><Ui.Icon icon={this.state.icon}/> {this.state.msg}</Ui.Link>;
        props.type = this.state.showPassword ? 'text' : 'password';

        return (
            <Ui.Input {...props}/>
        );
    }
};

export default Password;

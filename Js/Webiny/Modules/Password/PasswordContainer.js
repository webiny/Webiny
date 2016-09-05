import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class PasswordContainer extends Webiny.Ui.Component {
    constructor(props){
        super(props);

        this.state = {
            showPassword: false
        };
    }

}

PasswordContainer.defaultProps = {
    renderer() {
        const props = _.omit(this.props, ['renderer']);
        const type = this.state.showPassword ? 'text' : 'password';

        return (
            <w-password>
                <Ui.Input type={type} {...props}/>
                <Ui.Checkbox label="Show password" valueLink={this.bindTo('showPassword')} grid={12}/>
            </w-password>
        );
    }
};

export default PasswordContainer;

import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class PasswordContainer extends Webiny.Ui.Component {

    togglePassword() {
        console.log('toggling');

        return true;
    }

}

PasswordContainer.defaultProps = {
    renderer() {
        const props = _.omit(this.props, ['renderer']);

        return (
            <w-password>
                <Ui.Input type="password" {...props}/>
                <Ui.Checkbox label="Single checkbox" name="singleCheckbox" onChange={this.togglePassword} grid={12}/>
            </w-password>
        );
    }
};

export default PasswordContainer;

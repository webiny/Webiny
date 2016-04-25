import Webiny from 'Webiny';
import CheckboxGroup from './CheckboxGroup';

class CheckboxGroupContainer extends Webiny.Ui.OptionComponent {

    render() {
        return (
            <CheckboxGroup {...this.props} options={this.state.options}/>
        );
    }
}

export default CheckboxGroupContainer;
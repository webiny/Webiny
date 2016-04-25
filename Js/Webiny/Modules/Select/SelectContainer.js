import Webiny from 'Webiny';
import SelectInput from './SelectInput';

class SelectContainer extends Webiny.Ui.OptionComponent {

    render() {
        return (
            <SelectInput {..._.omit(this.props, ['ui'])} options={this.state.options}/>
        );
    }
}

export default SelectContainer;
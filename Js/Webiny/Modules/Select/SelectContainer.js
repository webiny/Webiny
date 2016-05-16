import Webiny from 'Webiny';
import SelectInput from './SelectInput';

class SelectContainer extends Webiny.Ui.OptionComponent {

    constructor(props) {
        super(props);
        this.bindMethods('getSelectedData');
    }

    getSelectedData() {
        return this.refs.input.getSelectedData();
    }

    render() {
        return (
            <SelectInput ref="input" {..._.omit(this.props, ['ui'])} options={this.state.options}/>
        );
    }
}

export default SelectContainer;
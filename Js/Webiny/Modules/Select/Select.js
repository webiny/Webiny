import Webiny from 'Webiny';
import SimpleSelect from './SimpleSelect';

class Select extends Webiny.Ui.OptionComponent {

    constructor(props) {
        super(props);
        this.bindMethods('getCurrentData,getPreviousData');
    }

    getCurrentData() {
        return this.refs.input.getCurrentData();
    }

    getPreviousData() {
        return this.refs.input.getPreviousData();
    }

    render() {
        return (
            <SimpleSelect ref="input" {..._.omit(this.props, ['ui'])} options={this.state.options}/>
        );
    }
}

export default Select;
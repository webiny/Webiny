import Webiny from 'Webiny';
import RadioGroup from './RadioGroup';

class RadioGroupContainer extends Webiny.Ui.OptionComponent {

    render() {
        return (
            <RadioGroup {...this.props} options={this.state.options}/>
        );
    }
}

export default RadioGroupContainer;
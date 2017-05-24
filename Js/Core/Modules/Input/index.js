import Webiny from 'Webiny';
import Input from './Input';
import SimpleInput from './SimpleInput';
import Mandat from './Components/Mandat';
import Label from './Components/Label';
import InfoMessage from './Components/InfoMessage';
import ValidationIcon from './Components/ValidationIcon';
import ValidationMessage from './Components/ValidationMessage';
import DescriptionMessage from './Components/DescriptionMessage';

class Module extends Webiny.Module {

    init() {
        this.name = 'Input';
        Webiny.Ui.Components.Input = Input;
        Webiny.Ui.Components.Input.Label = Label;
        Webiny.Ui.Components.Input.Mandat = Mandat;
        Webiny.Ui.Components.Input.InfoMessage = InfoMessage;
        Webiny.Ui.Components.Input.ValidationIcon = ValidationIcon;
        Webiny.Ui.Components.Input.ValidationMessage = ValidationMessage;
        Webiny.Ui.Components.Input.DescriptionMessage = DescriptionMessage;

        Webiny.Ui.Components.SimpleInput = SimpleInput;
    }
}

export default Module;

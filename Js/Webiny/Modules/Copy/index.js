import Webiny from 'Webiny';
import CopyInput from './CopyInput';
import CopyButton from './CopyButton';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Copy = {
            Input: CopyInput,
            Button: CopyButton
        };
    }
}

export default Module;

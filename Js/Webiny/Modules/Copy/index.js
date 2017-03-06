import Webiny from 'Webiny';
import CopyInput from './CopyInput';
import CopyButton from './CopyButton';

class Module extends Webiny.Module {

    init() {
        this.name = 'Copy';
        Webiny.Ui.Components.Copy = {
            Input: CopyInput,
            Button: CopyButton
        };
    }
}

export default Module;

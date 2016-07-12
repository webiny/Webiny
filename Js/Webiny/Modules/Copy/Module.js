import Webiny from 'Webiny';
import CopyInput from './CopyInput';
import CopyButton from './CopyButton';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);
        Webiny.Ui.Components.Copy = {
            Input: CopyInput,
            Button: CopyButton
        };
    }
}

export default Module;

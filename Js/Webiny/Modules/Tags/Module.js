import Webiny from 'Webiny';
import Tags from './Tags';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Tags = Tags;
    }
}

export default Module;

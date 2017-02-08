import Webiny from 'Webiny';
import SimpleTags from './SimpleTags';
import Tags from './Tags';

class Module extends Webiny.Module {

    init() {
        this.name = 'Tags';
        Webiny.Ui.Components.Tags = Tags;
        Webiny.Ui.Components.SimpleTags = SimpleTags;
    }
}

export default Module;

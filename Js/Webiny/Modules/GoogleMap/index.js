import Webiny from 'Webiny';
import GoogleMap from './GoogleMap';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.GoogleMap = GoogleMap;
    }
}

export default Module;

import Webiny from 'Webiny';
import Downloader from './Downloader';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Downloader = Downloader;
    }
}

export default Module;

import Webiny from 'Webiny';
import Downloader from './Downloader';

class Module extends Webiny.Module {

    init() {
        this.name = 'Downloader';
        Webiny.Ui.Components.Downloader = Downloader;
    }
}

export default Module;

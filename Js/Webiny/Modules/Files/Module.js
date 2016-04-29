import Webiny from 'Webiny';
import Avatar from './Avatar/Avatar';
import FileReader from './FileReader';
import FileCropper from './FileCropper';
import FileUploader from './FileUploader';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Files = {
            Avatar,
            FileReader,
            FileCropper,
            FileUploader
        };
    }
}

export default Module;

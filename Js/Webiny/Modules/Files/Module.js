import Webiny from 'Webiny';
import Avatar from './Avatar/Avatar';
import Gallery from './Gallery/Gallery';
import Image from './Gallery/Image';
import FileReader from './FileReader';
import FileCropper from './FileCropper';
import FileUploader from './FileUploader';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Files = {
            Avatar,
            Gallery,
            FileReader,
            FileCropper,
            FileUploader
        };

        Webiny.Ui.Components.Files.Gallery.Image = Image;
    }
}

export default Module;

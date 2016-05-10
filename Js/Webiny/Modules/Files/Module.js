import Webiny from 'Webiny';
import Avatar from './Avatar/Avatar';
import Gallery from './Gallery/Gallery';
import Image from './Gallery/Image';
import FileReader from './FileReader';
import InlineFileCropper from './InlineFileCropper';
import ModalFileCropper from './ModalFileCropper';
import FileUploader from './FileUploader';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Files = {
            Avatar,
            Gallery,
            FileReader,
            InlineFileCropper,
            ModalFileCropper,
            FileUploader
        };

        Webiny.Ui.Components.Files.Gallery.Image = Image;
    }
}

export default Module;

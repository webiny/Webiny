import Webiny from 'Webiny';
import Avatar from './Avatar/Avatar';
import Gallery from './Gallery/Gallery';
import GalleryImage from './Gallery/Image';
import Image from './Image/Image';
import FileReader from './FileReader';
import InlineFileCropper from './InlineFileCropper';
import ModalFileCropper from './ModalFileCropper';
import FileUploader from './FileUploader';
import ImageUploader from './Image/ImageUploader';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Files = {
            Avatar,
            Gallery,
            Image,
            ImageUploader,
            FileReader,
            InlineFileCropper,
            ModalFileCropper,
            FileUploader
        };

        Webiny.Ui.Components.Files.Gallery.Image = GalleryImage;
    }
}

export default Module;

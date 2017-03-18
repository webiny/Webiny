import Webiny from 'Webiny';
import Avatar from './Avatar/Avatar';
import Gallery from './Gallery/Gallery';
import GalleryImage from './Gallery/Image';
import Image from './Image/Image';
import SimpleFile from './File/SimpleFile';
import FileReader from './FileReader';
import InlineFileCropper from './InlineFileCropper';
import ModalFileCropper from './ModalFileCropper';
import FileUploader from './FileUploader';
import ImageUploader from './Image/ImageUploader';
import ImageComponent from './Base/ImageComponent';

class Module extends Webiny.Module {

    init() {
        this.name = 'Files';
        Webiny.Ui.ImageComponent = ImageComponent;
        Webiny.Ui.Components.Files = {
            Avatar,
            Gallery,
            Image,
            File: SimpleFile,
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

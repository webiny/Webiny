import Webiny from 'Webiny';
import Image from './Image';
import ImageSet from './ImageSet';

class Module extends Webiny.Module {

    init() {
        this.name = 'LazyImage';
        Webiny.Ui.Components.LazyImage = {Image, ImageSet};
    }
}

export default Module;

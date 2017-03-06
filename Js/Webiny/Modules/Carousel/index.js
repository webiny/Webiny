import Webiny from 'Webiny';
import Carousel from './Carousel';

class Module extends Webiny.Module {

    init() {
        this.name = 'Carousel';
        Webiny.Ui.Components.Carousel = Carousel;
    }
}

export default Module;

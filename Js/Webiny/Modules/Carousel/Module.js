import Webiny from 'Webiny';
import Carousel from './Carousel';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Carousel = Carousel;
    }
}

export default Module;

import Webiny from 'Webiny';
import Button from './Button';

class Module extends Webiny.Module {

    init() {
        this.name = 'Button';
        Webiny.Ui.Components.Button = Button;
        
        // Force webpack to build this component to be ready for dynamic import
        () => import('Webiny/Ui/Button');
    }
}

export default Module;

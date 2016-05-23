import Webiny from 'Webiny';
import Dropdown from './Dropdown';
import Divider from './Divider';
import Header from './Header';
import Link from './Link';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Dropdown = {
            Dropdown,
            Header,
            Divider,
            Link
        };
    }
}

export default Module;

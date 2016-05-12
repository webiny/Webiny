import Webiny from 'Webiny';
import Body from './Body';
import Header from './Header';
import Tile from './Tile';

class Module extends Webiny.Module {

    init() {
        Webiny.Ui.Components.Tile = {Tile, Header, Body};
    }
}

export default Module;

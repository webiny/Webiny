import Webiny from 'Webiny';
import Body from './Body';
import Header from './Header';
import Tile from './Tile';

class Module extends Webiny.Module {

    init() {
        this.name = 'Tile';
        Tile.Header = Header;
        Tile.Body = Body;
        Webiny.Ui.Components.Tile = Tile;
    }
}

export default Module;

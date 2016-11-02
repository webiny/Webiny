import Webiny from 'Webiny';
import EditorView from './View';

class Module extends Webiny.Module {

    init() {
        const Menu = Webiny.Ui.Menu;

        this.registerMenus(
            new Menu('Editor', 'Editor.View', 'fa-font')
        );

        this.registerRoutes(
            new Webiny.Route('Editor.View', '/draftjs', EditorView, 'DraftJs Editor')
        );
    }
}

export default Module;
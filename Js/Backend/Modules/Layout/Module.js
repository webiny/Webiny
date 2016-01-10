import Webiny from 'Webiny';
import Views from './Views/Views';
import Actions from './Actions/Actions';
import Components from './Components/Components';

class Module extends Webiny.Module {

    constructor(app) {
        super(app);

        this.name = 'Layout';
        this.setComponents(Components);
        this.setViews(Views);
        this.setActions(Actions);

        this.addDefaultComponents({
            MasterLayout: Views.Main
        });

        this.setRoutes(new Webiny.Route('Dashboard', '/', {
            MasterContent: Views.Example,
            Header: Components.Navigation
        }));
    }
}

export default Module;

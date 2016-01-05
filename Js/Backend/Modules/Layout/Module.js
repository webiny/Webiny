import Webiny from 'Webiny';
import Views from './Views/Views';

class LayoutModule extends Webiny.Module {

    constructor(app) {
        super(app);

        this.name = 'Layout';
        this.setViews(Views);
        this.addDefaultComponents({
            Layout: Views.Main
        });

        this.setRoutes(new Webiny.Route('Dashboard', '/', {
            MasterContent: Views.Example,
            Header: Views.Header
        }));
    }
}

export default LayoutModule;

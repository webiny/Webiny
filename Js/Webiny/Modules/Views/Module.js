import Webiny from 'Webiny';
import Views from './Views';

class ViewsModule extends Webiny.Module {

    constructor(app) {
        super(app);

        this.name = 'Views';

        _.assign(Webiny.Ui.Views, Views);
    }
}

export default ViewsModule;

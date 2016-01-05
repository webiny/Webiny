import Webiny from 'Webiny';
import Views from './Views';

class ViewsModule extends Webiny.Module {

	constructor(app) {
		super(app);

		this.name = 'Views';

		Webiny.Ui.Views = Views;
	}
}

export default ViewsModule;

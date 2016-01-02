import Views from './Views';

class ViewsModule extends Webiny.Module {

	constructor(app) {
		super(app);

		this.name = 'Views';

		window.Webiny.Ui.Views = Views;
	}
}

export default ViewsModule;
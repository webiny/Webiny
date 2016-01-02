import Views from './Views';

class ViewsModule extends Webiny.Module {

	constructor(app) {
		super(app);

		this.name = 'ViewsModule';

		window.Webiny.Ui.Views = Views;
	}
}

export default ViewsModule;
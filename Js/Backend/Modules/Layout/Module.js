import Views from './Views/Views';

class LayoutModule extends Webiny.Module {

	constructor(app) {
		super(app);

		this.name = 'Layout';
		this.setViews(Views);
		this.addDefaultComponents({
			Layout: Views.Main
		});

		Webiny.Router.setDefaultRoute(new Webiny.Route('Dashboard', '/', { MasterContent: Views.Example }));
	}
}

export default LayoutModule;

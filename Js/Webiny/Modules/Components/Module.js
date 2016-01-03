import Components from './Components';

class Module extends Webiny.Module {

	constructor(app) {
		super(app);

		this.name = 'Components';

		window.Webiny.Ui.Components = Components;
	}
}

export default Module;

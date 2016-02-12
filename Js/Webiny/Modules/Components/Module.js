import Webiny from 'Webiny';
import Placeholder from './Placeholder';
import Link from './Link';

class Module extends Webiny.Module {

	constructor(app) {
		super(app);

		this.name = 'Components';

        Webiny.Ui.Placeholder = Placeholder;
        Webiny.Ui.Link = Link;
	}
}

export default Module;

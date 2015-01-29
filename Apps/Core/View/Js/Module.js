import BaseModule from '/Core/Base/BaseModule'

import Link from '/Apps/Core/View/Js/Components/Link/Link';
import Input from '/Apps/Core/View/Js/Components/Input/Input';
import Checkbox from '/Apps/Core/View/Js/Components/Checkbox/Checkbox';
import Form from '/Apps/Core/View/Js/Components/Form/Form';
import FormGroup from '/Apps/Core/View/Js/Components/FormGroup/FormGroup';
import GridRow from '/Apps/Core/View/Js/Components/GridRow/GridRow';
import GridContainer from '/Apps/Core/View/Js/Components/GridContainer/GridContainer';
import Grid12 from '/Apps/Core/View/Js/Components/Grid12/Grid12';
import Grid6 from '/Apps/Core/View/Js/Components/Grid6/Grid6';

window.Link = Link.createInstance();
window.Input = Input.createInstance();
window.Checkbox = Checkbox.createInstance();
window.Form = Form.createInstance();
window.FormGroup = FormGroup.createInstance();
window.GridRow = GridRow.createInstance();
window.GridContainer = GridContainer.createInstance();
window.Grid12 = Grid12.createInstance();
window.Grid6 = Grid6.createInstance();

class View extends BaseModule{

	registerRoutes() {
		return {}
	}
}

export default View;
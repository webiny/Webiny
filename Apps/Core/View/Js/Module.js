import BaseModule from '/Core/Base/BaseModule'
/*
 import Label from '/Apps/Core/View/Js/Components/Label/Label';*/
import Input from '/Apps/Core/View/Js/Components/Input/Input';
import Link from '/Apps/Core/View/Js/Components/Link/Link';
import Form from '/Apps/Core/View/Js/Components/Form/Form';
import FormGroup from '/Apps/Core/View/Js/Components/FormGroup/FormGroup';
import FormInline from '/Apps/Core/View/Js/Components/FormInline/FormInline';
import ChatBox from '/Apps/Core/View/Js/Components/ChatBox/ChatBox';
/*
 import Checkbox from '/Apps/Core/View/Js/Components/Checkbox/Checkbox';
 import GridRow from '/Apps/Core/View/Js/Components/GridRow/GridRow';
 import GridContainer from '/Apps/Core/View/Js/Components/GridContainer/GridContainer';
 import Grid12 from '/Apps/Core/View/Js/Components/Grid12/Grid12';
 import Grid6 from '/Apps/Core/View/Js/Components/Grid6/Grid6';

window.Input = Input.createInstance();
 window.Label = Label.createInstance();*/
window.Link = Link.createInstance();

/*window.Form = Form.createInstance();
window.FormGroup = FormGroup.createInstance();
window.FormInline = FormInline.createInstance();*/
/*
window.ChatBox = ChatBox.createInstance();
 window.Checkbox = Checkbox.createInstance();
 window.GridRow = GridRow.createInstance();
 window.GridContainer = GridContainer.createInstance();
 window.Grid12 = Grid12.createInstance();
 window.Grid6 = Grid6.createInstance();*/

class View extends BaseModule {

	registerRoutes() {

		return {};

		var chatBox = ChatBox;

		console.log(React.createElement(chatBox))

		return {
			'/': {
				LeftContent: {
					component: chatBox
				}
			},
			'/box': {
				RightContent: {
					component: chatBox
				}
			}
		};
	}
}

export default View;
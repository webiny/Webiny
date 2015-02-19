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

 window.Label = Label.createComponent();*/

//window.Form = Form.createComponent();
/*
 window.Checkbox = Checkbox.createComponent();
 window.GridRow = GridRow.createComponent();
 window.GridContainer = GridContainer.createComponent();
 window.Grid12 = Grid12.createComponent();
 window.Grid6 = Grid6.createComponent();*/

class View extends BaseModule {

	registerComponents() {
		return {
			Input: Input,
			Link: Link,
			FormInline: FormInline,
			FormGroup: FormGroup,
			MyChatBox: ChatBox
		};
	}

	registerRoutes() {

		var chatBox1 = ChatBox.createElement({saveState: true});
		var chatBox2 = ChatBox.createElement({saveState: true});

		return {
			'/': {
				LeftContent: {
					component: chatBox1,
					newInstance: false
				}
			},
			'/box': {
				RightContent: {
					component: chatBox2,
					newInstance: false
				}
			}
		};
	}
}

export default View;
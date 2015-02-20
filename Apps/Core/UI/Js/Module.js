import BaseModule from '/Core/Base/BaseModule';

import Label from '/Apps/Core/UI/Js/Components/Label/Label';
import Input from '/Apps/Core/UI/Js/Components/Input/Input';
import Link from '/Apps/Core/UI/Js/Components/Link/Link';
import Form from '/Apps/Core/UI/Js/Components/Form/Form';
import FormGroup from '/Apps/Core/UI/Js/Components/FormGroup/FormGroup';
import FormInline from '/Apps/Core/UI/Js/Components/FormInline/FormInline';
import Checkbox from '/Apps/Core/UI/Js/Components/Checkbox/Checkbox';
import ChatBox from '/Apps/Core/UI/Js/Components/ChatBox/ChatBox';
import GridRow from '/Apps/Core/UI/Js/Components/GridRow/GridRow';
import GridContainer from '/Apps/Core/UI/Js/Components/GridContainer/GridContainer';
import Grid12 from '/Apps/Core/UI/Js/Components/Grid12/Grid12';
import Grid6 from '/Apps/Core/UI/Js/Components/Grid6/Grid6';

class UI extends BaseModule {

	registerComponents() {
		return {
			Label: Label,
			Input: Input,
			Link: Link,
			Form: Form,
			FormGroup: FormGroup,
			FormInline: FormInline,
			Checkbox: Checkbox,
			GridRow: GridRow,
			GridContainer: GridContainer,
			Grid12: Grid12,
			Grid6: Grid6,
			ChatBox: ChatBox
		};
	}
}

export default UI;
import BaseModule from '/Core/Base/BaseModule';

import Label from '/Apps/Core/View/Js/Components/Label/Label';
import Input from '/Apps/Core/View/Js/Components/Input/Input';
import Link from '/Apps/Core/View/Js/Components/Link/Link';
import Form from '/Apps/Core/View/Js/Components/Form/Form';
import FormGroup from '/Apps/Core/View/Js/Components/FormGroup/FormGroup';
import FormInline from '/Apps/Core/View/Js/Components/FormInline/FormInline';
import Checkbox from '/Apps/Core/View/Js/Components/Checkbox/Checkbox';
import GridRow from '/Apps/Core/View/Js/Components/GridRow/GridRow';
import GridContainer from '/Apps/Core/View/Js/Components/GridContainer/GridContainer';
import Grid12 from '/Apps/Core/View/Js/Components/Grid12/Grid12';
import Grid6 from '/Apps/Core/View/Js/Components/Grid6/Grid6';

class View extends BaseModule {

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
			Grid6: Grid6
		};
	}
}

export default View;
import BaseComponent from '/Core/Base/BaseComponent';

class Th extends BaseComponent {

	getTemplate(){ return '<th>{this.props.children}</th>';
	}

	getFqn(){
		return 'Core.Table.Th';
	}
}

export default Th;

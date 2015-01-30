import BaseComponent from '/Core/Base/BaseComponent';

class Tbody extends BaseComponent {

	getTemplate(){ return '<tbody>{this.props.children}</tbody>';
	}

	getFqn(){
		return 'Core.Table.Tbody';
	}
}

export default Tbody;

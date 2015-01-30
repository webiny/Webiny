import BaseComponent from '/Core/Base/BaseComponent';

class Td extends BaseComponent {

	getTemplate(){ return '<td>{this.props.children}</td>';
	}

	getFqn(){
		return 'Core.Table.Td';
	}
}

export default Td;

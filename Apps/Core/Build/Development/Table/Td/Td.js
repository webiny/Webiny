import BaseComponent from '/Core/Base/BaseComponent';

class Td extends BaseComponent {

	getTemplate(){ return "React.createElement(\"td\", {className: this.props.className}, this.props.children)";}

	getFqn(){
		return 'Core.Table.Td';
	}
}

export default Td;

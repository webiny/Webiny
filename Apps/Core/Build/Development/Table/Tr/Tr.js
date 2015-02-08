import BaseComponent from '/Core/Base/BaseComponent';

class Tr extends BaseComponent {

	getTemplate(){ return "React.createElement(\"tr\", {className: this.props.className}, this.props.children)";}

	getFqn(){
		return 'Core.Table.Tr';
	}
}

export default Tr;

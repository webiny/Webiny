import BaseComponent from '/Core/Base/BaseComponent';

class Tbody extends BaseComponent {

	getTemplate(){ return "React.createElement(\"tbody\", {className: this.props.className}, this.props.children)";}

	getFqn(){
		return 'Core.Table.Tbody';
	}
}

export default Tbody;

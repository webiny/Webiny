import BaseComponent from '/Core/Base/BaseComponent';

class Tfoot extends BaseComponent {

	getTemplate(){ return "React.createElement(\"tfoot\", {className: this.props.className}, this.props.children)";}

	getFqn(){
		return 'Core.Table.Tfoot';
	}
}

export default Tfoot;

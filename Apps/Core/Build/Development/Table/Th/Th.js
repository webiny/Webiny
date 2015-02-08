import BaseComponent from '/Core/Base/BaseComponent';

class Th extends BaseComponent {

	getTemplate(){ return "React.createElement(\"th\", {className: this.props.className}, this.props.children)";}

	getFqn(){
		return 'Core.Table.Th';
	}
}

export default Th;

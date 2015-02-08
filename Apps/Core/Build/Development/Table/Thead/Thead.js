import BaseComponent from '/Core/Base/BaseComponent';

class Thead extends BaseComponent {

	getTemplate(){ return "React.createElement(\"thead\", {className: this.props.className}, this.props.children)";}

	getFqn(){
		return 'Core.Table.Thead';
	}
}

export default Thead;

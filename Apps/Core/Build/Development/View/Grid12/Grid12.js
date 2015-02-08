import BaseComponent from '/Core/Base/BaseComponent';

class Grid12 extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"col-xs-12 col-sm-12\"}, this.props.children)";}

	getFqn(){
		return 'Core.View.Grid12';
	}
}

export default Grid12;

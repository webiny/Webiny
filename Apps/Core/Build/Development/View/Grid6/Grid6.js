import BaseComponent from '/Core/Base/BaseComponent';

class Grid6 extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"col-xs-12 col-sm-6\"}, this.props.children)";}

	getFqn(){
		return 'Core.View.Grid6';
	}
}

export default Grid6;

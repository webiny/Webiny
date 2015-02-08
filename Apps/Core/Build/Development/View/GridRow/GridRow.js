import BaseComponent from '/Core/Base/BaseComponent';

class GridRow extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"row\"}, this.props.children)";}

	getFqn(){
		return 'Core.View.GridRow';
	}
}

export default GridRow;

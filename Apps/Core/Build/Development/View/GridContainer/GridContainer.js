import BaseComponent from '/Core/Base/BaseComponent';

class GridContainer extends BaseComponent {

	getTemplate(){ return "React.createElement(\"div\", {className: \"container\"}, this.props.children)";}

	getFqn(){
		return 'Core.View.GridContainer';
	}
}

export default GridContainer;

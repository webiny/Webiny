import BaseComponent from '/Core/Base/BaseComponent';

class GridContainer extends BaseComponent {

	getTemplate(){ return "<div className=\"container\">{this.props.children}<\/div>";}

	getFqn(){
		return 'Core.View.GridContainer';
	}
}

export default GridContainer;

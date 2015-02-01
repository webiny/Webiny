import BaseComponent from '/Core/Base/BaseComponent';

class GridRow extends BaseComponent {

	getTemplate(){ return "<div className=\"row\">{this.props.children}<\/div>";}

	getFqn(){
		return 'Core.View.GridRow';
	}
}

export default GridRow;

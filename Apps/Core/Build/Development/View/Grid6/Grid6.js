import BaseComponent from '/Core/Base/BaseComponent';

class Grid6 extends BaseComponent {

	getTemplate(){ return '<div className="col-xs-12 col-sm-6">{this.props.children}</div>';
	}

	getFqn(){
		return 'Core.View.Grid6';
	}
}

export default Grid6;

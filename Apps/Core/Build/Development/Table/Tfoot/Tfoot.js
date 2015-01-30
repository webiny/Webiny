import BaseComponent from '/Core/Base/BaseComponent';

class Tfoot extends BaseComponent {

	getTemplate(){ return '<tfoot>{this.props.children}</tfoot>';
	}

	getFqn(){
		return 'Core.Table.Tfoot';
	}
}

export default Tfoot;

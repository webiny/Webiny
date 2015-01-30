import BaseComponent from '/Core/Base/BaseComponent';

class Table extends BaseComponent {

	getTemplate(){ return '<table className="table">{this.props.children}</table>';
	}

	getFqn(){
		return 'Core.Table.Table';
	}
}

export default Table;

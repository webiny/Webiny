import BaseComponent from '/Core/Base/BaseComponent';

class Th extends BaseComponent {

	getTemplate(){ return "<th className={this.props.className}>{this.props.children}<\/th>";}

	getFqn(){
		return 'Core.Table.Th';
	}
}

export default Th;

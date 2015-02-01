import BaseComponent from '/Core/Base/BaseComponent';

class Thead extends BaseComponent {

	getTemplate(){ return "<thead className={this.props.className}>{this.props.children}<\/thead>";}

	getFqn(){
		return 'Core.Table.Thead';
	}
}

export default Thead;

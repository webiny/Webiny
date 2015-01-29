import BaseComponent from '/Core/Base/BaseComponent';

class InputRow extends BaseComponent {

	getTemplate(){ return '<div className="form-group">{this.props.children}</div>';
	}

	getFqn(){
		return 'Core.View.InputRow';
	}

	getDefaultProperties(){
		return {
			layout: '12'
		}
	}
	
	componentDidMount(){
		if(this.props.children instanceof Array){
			var grids = this.props.layout.split('-');
			this.props.children.forEach((cmp, i) => {
				window['cmp'+i] = cmp;
				var props = cmp.props;
				if(props){
					cmp.props['grid'] = grids[i];
					cmp._owner.render();
				}
			});
		}
	}
}

export default InputRow;

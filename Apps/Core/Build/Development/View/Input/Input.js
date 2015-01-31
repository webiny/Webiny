import BaseComponent from '/Core/Base/BaseComponent';

class Input extends BaseComponent {

	getTemplate(){ return '<div className={this.classSet(this.state.css)}><input disabled={this.props.disabled} type="text" className="form-control" valueLink={this.props.valueLink} placeholder={this.props.placeholder}/></div>';
	}

	getFqn() {
		return 'Core.View.Input';
	}

	getInitialState() {
		var css = 'col-sm-' + this.props.grid;

		var state = {
			css: {}
		};
		state.css[css] = true;
		return state;
	}

	getDefaultProperties() {
		return {
			disabled: false,
			placeholder: '',
			grid: 12,
			name: null
		}
	}

	getNode() {
		return this.getDOMNode().querySelector('input');
	}
}

export default Input;

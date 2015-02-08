import BaseComponent from '/Core/Base/BaseComponent';

class Label extends BaseComponent {

	getTemplate(){ return "React.createElement(\"label\", {className: this.classSet(this.state.css), \"class-obj\": this.state.css}, this.props.children)";}

	getFqn() {
		return 'Core.View.Label';
	}

	getInitialState() {
		var state = {
			css: {
				"control-label": true
			}
		};
		
		if(this.props.grid !== false){
			var css = "col-sm-" + this.props.grid;
			state.css[css] = true;
		}

		return state;
	}

	getDefaultProperties() {
		return {
			grid: 2
		};
	}
}

export default Label;

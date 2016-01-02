import Component from './../../../../Lib/Core/Component';

class SwitchButton extends Component {
	constructor() {
		super();

		this.bindMethods('switch');
	}

	componentWillMount() {
		this.id = Webiny.Tools.createUID();
	}

	render() {
		var value = this.props.value || null;
		if (this.props.valueLink) {
			value = this.props.valueLink.value;
		}
		var classes = this.classSet('switch round switch-' + this.props.type);
		if(this.props.disabled){
			classes += ' disabled';
		}

		var id = this.id;

		return (
			<div style={this.props.style} className={classes}>
				<input id={id} type="checkbox" readOnly checked={value === true}/>
				<label htmlFor={id} onClick={this.switch}></label>
			</div>
		);
	}

	switch() {
		var el = ReactDOM.findDOMNode(this).querySelector('input');
		var checked = !el.checked;
		if (this.props.valueLink) {
			this.props.valueLink.requestChange(checked, this.props.bindChange || null);
		} else {
			if (this.props.onChange) {
				this.props.onChange(checked);
			}
		}
	}
}

SwitchButton.defaultProps = {
	type: 'info',
	style: {}
};

export default SwitchButton;

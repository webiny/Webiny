import InputComponent from './../Base/InputComponent';

class Radio extends InputComponent {

	constructor() {
		super();

		this.bindMethods('onChange');
	}

	componentWillMount() {
		super.componentWillMount();
		this.id = Webiny.Tools.createUID();
	}

	render() {
		var id = this.id;
		var state = this.props.stateKey;

		if (state === "false") {
			state = false;
		} else if (state === "true") {
			state = true;
		}

		var checked = state === this.props.state;

		var css = this.classSet('radio-custom mt10', this.props.className);

		return <div className={css}>
			<input type="radio" disabled={this.props.disabled} onChange={this.onChange} checked={checked} id={id}/>
			<label htmlFor={id}>{this.props.label}</label>
		</div>;
	}

	onChange() {
		this.props.onChange(this.props.stateKey);
	}

	shouldComponentUpdate(props) {
		var update = super.shouldComponentUpdate(props);

		if(!update){
			var keys = [
				'state',
				'stateKey'
			];

			keys.forEach(key => {
				if(_.get(this.props, key) != _.get(props, key)) {
					update = true;
				}
			});
		}

		return update;
	}
}

Radio.defaultProps = {
	disabled: false,
	label: '',
	className: ''
};

export default Radio;
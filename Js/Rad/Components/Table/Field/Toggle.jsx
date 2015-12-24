import Field from './Field';

class Toggle extends Field {

	render() {
		if (!this.props.field) {
			throw Error('You must specify a field name to toggle!');
		}

		var props = {
			style: {width: '52px', margin: '0 auto'},
			onChange: () => {
				this.emitField()
			},
			value: this.props.data[this.props.field],
			disabled: this.props.disabled
		};

		return (
			<Rad.Components.Form.Switch {...props}/>
		);
	}
}

Toggle.defaultProps = {
	field: false,
	disabled: false
};

export default Toggle;
import SearchComponent from './SearchComponent';

class VerticalSearch extends SearchComponent {

	constructor() {
		super();
	}

	render() {
		var input = this.getSearchInput();

		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

		var parts = [label, input, validationError];
		if(!this.state.loading){
			parts.push(validationIcon);
		}

		parts = this.addKeys(parts);

		var css = this.classSet('form-group', validationClass);

		return (
			<div className={this.getComponentWrapperClass()} style={{marginBottom: '15px'}}>
				<div className={css}>{parts}</div>
			</div>
		);
	}
}

export default VerticalSearch;

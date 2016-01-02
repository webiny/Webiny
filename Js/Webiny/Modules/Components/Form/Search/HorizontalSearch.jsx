import SearchComponent from './SearchComponent';

class HorizontalSearch extends SearchComponent {

	constructor() {
		super();
	}

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();
		var input = this.getSearchInput();

		var label = null;
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
		}

		var parts = [input, validationError];
		if (!this.state.loading) {
			parts.push(validationIcon);
		}

		parts = this.addKeys(parts);

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={this.classSet('form-group label-left', validationClass)}>{label}
					<div className="col-xs-8">{parts}</div>
				</div>
			</div>
		);
	}
}

export default HorizontalSearch;

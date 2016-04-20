import Webiny from 'Webiny';

class Fieldset extends Webiny.Ui.Component {

	render() {
		return (
			<div className="options-section">
				<div className="options-header">
					<h5 className="options-title">{this.props.title}</h5>
					<div className="form-group form-group--inline-label search-container">{this.props.children}</div>
				</div>
			</div>
		);
	}
}

export default Fieldset;

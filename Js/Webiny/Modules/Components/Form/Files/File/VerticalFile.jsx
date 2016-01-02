import BaseFile from './BaseFile';

class VerticalFile extends BaseFile {

	constructor() {
		super();
	}

	render() {
		var {validationError, validationIcon, validationClass} = this.getValidationValues();

		var css = this.classSet('form-group', validationClass);
		var label = null;
		if (this.props.label) {
			label = <label className="control-label">{this.props.label}</label>;
		}

		var input = (
			<div className="choose-file">
				<input onBlur={this.validate}
					   disabled="disabled"
					   type="text"
					   className="form-control"
					   placeholder={this.props.placeholder}
					   ref="input"
					   readOnly={true}
					   value={this.props.valueLink.value && this.props.valueLink.value.name}
					/>

				<div className="fileUpload btn btn-primary" onClick={this.getFiles}>
					<span>{this.props.actionLabel}</span>
					<Webiny.Ui.Components.Form.Files.FileReader sizeLimit={10000000} accept={this.props.accept} ref="reader" onChange={this.fileChanged}/>
				</div>
			</div>
		);

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>
					{label}
					{input}
					{validationError}
					{validationIcon}
				</div>
			</div>
		);
	}
}

export default VerticalFile;
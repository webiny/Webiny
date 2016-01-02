import Component from './../../../../Lib/Core/Component';

class FileReader extends Component {

	constructor() {
		super();

		this.bindMethods('onChange', 'getFiles', 'readFiles');
	}

	getFiles() {
		ReactDOM.findDOMNode(this).click();
	}

	onChange(e) {
		this.readFiles(e.target.files);
	}

	readFiles(files) {
		var output = [];
		var errors = [];
		var loadedFiles = 0;

		_.each(files, file => {
			var reader = new window.FileReader();

			reader.onload = ((f) => {
				return (e) => {
					loadedFiles++;
					var data = {
						name: f.name,
						size: f.size,
						type: f.type
					};

					var errorMessage = null;
					if (this.props.accept.length && this.props.accept.indexOf(file.type) == -1) {
						errorMessage = 'Unsupported file type (' + file.type + ')';
					} else if (this.props.sizeLimit < file.size) {
						errorMessage = 'File is too big';
					}

					if (!errorMessage) {
						data.src = e.target.result;
						output.push(data);
					} else {
						data.message = errorMessage;
						errors.push(data);
					}


					if (loadedFiles == files.length) {
						this.props.onChange.apply(this, this.props.multiple ? [output, errors] : [output[0] || null, errors[0] || null]);
						ReactDOM.findDOMNode(this).value = null;
					}
				};
			})(file);

			reader.readAsDataURL(file);
		});
	}

	render() {
		return (
			<input accept={this.props.accept}
				   style={{display: 'none'}}
				   type="file"
				   multiple={this.props.multiple}
				   onChange={this.onChange}/>
		);
	}
}

FileReader.defaultProps = {
	accept: '',
	multiple: false,
	sizeLimit: 2097152
};

export default FileReader;
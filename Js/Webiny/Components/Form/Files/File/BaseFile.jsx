import InputComponent from './../../Base/InputComponent';

class BaseFile extends InputComponent {

	constructor() {
		super();

		this.lastId = null;

		this.bindMethods('getFiles,fileChanged');
	}

	getFiles(e) {
		e.stopPropagation();
		this.refs.reader.getFiles();
	}

	fileChanged(file, error) {
		if (file.src) {
			file.id = _.get(this.props.valueLink.value, 'id', this.lastId);
			this.props.valueLink.requestChange(file);
		}
	}
}

BaseFile.defaultProps = {
	accept: [],
	actionLabel: 'Select file'
};

export default BaseFile;
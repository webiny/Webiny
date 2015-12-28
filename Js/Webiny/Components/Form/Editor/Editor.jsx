import InputComponent from './../Base/InputComponent';
import ApiService from './../../../Lib/Api/Service';
import FileUploader from './../Files/FileUploader';

class Editor extends InputComponent {

	constructor() {
		super();

		this.api = new ApiService('/files');
		this.uploader = new FileUploader(this.api);

		this.state = {
			cropImage: null,
			uploadPercentage: null
		};

		this.bindMethods('onCropperHidden', 'applyCropping');
	}

	componentDidMount() {
		this.editor = $(ReactDOM.findDOMNode(this)).find('.editor');
		this.editor.summernote({
			onInit: () => {
				this.editor.code(this.props.valueLink.value);
			},
			disableDragAndDrop: true,
			onMediaDelete: (img) => {
				if (img[0].dataset.id) {
					this.api.delete(img[0].dataset.id);
				}
			},
			minHeight: 500,
			dialogsInBody: true,
			toolbar: [
				['style', ['bold', 'italic', 'underline', 'clear']],
				['fontsize', ['fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['insert', ['link', 'picture']],
				['misc', ['codeview']]
			],
			onImageUpload: (files, editor, welEditable) => {
				let file = files[0];

				let reader = new window.FileReader();

				reader.onload = ((f) => {
					return (e) => {
						let data = {
							name: f.name,
							size: f.size,
							type: f.type,
							src: e.target.result
						};
						this.setState({cropImage: data});
					};
				})(file);

				reader.readAsDataURL(file);
			}
		});
		this.editor.on('summernote.change', (customEvent, contents) => {
			this.props.valueLink.requestChange(contents);
		});
	}

	applyCropping(data) {
		this.uploader.upload(data, (percentage) => {
			this.setState({uploadPercentage: percentage});
		}, file => {
			let imgNode = document.createElement('img');
			imgNode.src = file.src;
			imgNode.setAttribute('data-id', file.id);
			this.editor.summernote('insertNode', imgNode);
			this.setState({uploadPercentage: null});
		});
	}

	onCropperHidden() {
		this.setState({cropImage: null});
	}

	componentWillUnmount() {
		this.editor.destroy();
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.cropImage != this.state.cropImage || nextState.uploadPercentage != this.state.uploadPercentage;
	}

	componentWillReceiveProps(props) {
		if (this.editor.code() != props.valueLink.value) {
			this.editor.code(props.valueLink.value);
		}
	}

	render() {
		let uploader = null;
		if (this.state.uploadPercentage != null) {
			uploader = (
				<div>
					<strong>Your image is being uploaded...</strong>
					<Rad.Components.Progress progress={this.state.uploadPercentage}/>
				</div>
			);
		}

		let css = 'form-group';

		let label = null;
		let wrapperClass = '';
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
			wrapperClass = 'col-xs-8';
		}

		return (
			<div className={this.getComponentWrapperClass()}>
				<div className={css}>
					{label}
					<div className={wrapperClass}>
						{uploader}
						<div className="editor"></div>
						<div className="tooltip-cont"></div>
						<Rad.Components.Form.Files.FileCropper
							onHidden={this.onCropperHidden}
							onCrop={this.applyCropping}
							config={{
								autoCropArea: 1,
								guides: false,
								strict: true,
								zoomable: false
							}}
							image={this.state.cropImage}
							/>
					</div>
				</div>
			</div>
		);
	}
}

export default Editor;
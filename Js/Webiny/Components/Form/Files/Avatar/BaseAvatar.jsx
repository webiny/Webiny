import ImageComponent from './../Base/ImageComponent';

class BaseAvatar extends ImageComponent {

	constructor() {
		super();

		this.bindMethods(
			'onDrop',
			'onDragOver',
			'onDragLeave'
		);
	}

	onDragOver(e) {
		e.preventDefault();
		this.setState({
			dragOver: true
		});
	}

	onDragLeave(evt) {
		this.setState({
			dragOver: false
		});
	}

	onDrop(evt) {
		evt.preventDefault();
		evt.persist();

		this.setState({
			dragOver: false
		});

		this.refs.reader.readFiles(evt.dataTransfer.files);
	}

	renderAvatar() {
		return this.props.render.call(this);
	}
}

BaseAvatar.defaultProps = {
	accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
	cropper: false,
	defaultImage: '',
	width: 250,
	height: 250,
	render: function () {
		var model = this.props.valueLink.value;

		var imageSrc = this.props.defaultImage;
		if (model) {
			imageSrc = model.src;
		}
		var imageStyle = {
			height: this.props.height,
			width: this.props.width
		};

		var size = null;
		if (model) {
			size = <div className="dz-size">{filesize(model.size)}</div>;
		}

		var name = _.get(model, 'name', '');

		var imageAction = <a className="dz-remove" href="javascript:" onClick={this.getFiles}>Select file</a>;
		if (model) {
			imageAction = <a className="dz-remove" href="javascript:" onClick={this.removeFile}>Remove file</a>;
		}

		var cropper = null;
		if (this.props.cropper && this.state.showCrop) {
			cropper = (
				<Webiny.Ui.Components.Form.Files.FileCropper
					title={this.props.cropper.title}
					action={this.props.cropper.action}
					onHidden={this.onCropperHidden}
					onCrop={this.applyCropping}
					config={this.props.cropper.config}
					image={this.state.cropImage}
					/>
			);
		}

		var previewStyle = {
			'dz-drag-hover': this.state.dragOver,
			'dz-preview dz-processing mn': true
		};

		var props = {
			onDrop: this.onDrop,
			onDragLeave: this.onDragLeave,
			onDragOver: this.onDragOver,
			className: 'avatar mn pn',
			onClick: this.getFiles
		};

		return (
			<div {...props}>
				<div className={this.classSet(previewStyle)}>
					<div className="dz-details" style={imageStyle}>
						<div className="dz-filename">
							<span>{name}</span>
						</div>
						{size}
						<img style={imageStyle} src={imageSrc} className="img-responsive"/>
					</div>
					{imageAction}
				</div>
				<Webiny.Ui.Components.Form.Files.FileReader accept={this.props.accept} ref="reader" onChange={this.fileChanged}/>
				{cropper}
			</div>
		);
	}
};

export default BaseAvatar;
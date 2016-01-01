import ImageComponent from './../Base/ImageComponent';

class PlainImage extends ImageComponent {

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

	editFile(e) {
		e.stopPropagation();
		this.setState({
			showCrop: true,
			cropImage: this.props.valueLink.value
		});
	}

	renderImage() {
		let model = this.props.valueLink.value;

		let message = null;
		if (!model) {
			message = (
				<div className="dz-default dz-message">
					<span>
						<i className="fa fa-cloud-upload"></i>
						<span className="main-text"><b>Drop Files</b> to upload
						</span> <br/>
						<span className="sub-text">(or click)</span>
					</span>
				</div>
			);
		}

		let css = {
			'dropzone dropzone-sm dz-clickable': !model,
			'dz-drag-hover': this.state.dragOver,
			'pn': model
		};

		let imageStyle = {
			width: '0%',
			height: 'auto'
		};

		if (this.state.containerWidth > 0 && this.state.actualWidth > 0) {
			if (this.state.containerWidth < this.state.actualWidth) {
				imageStyle = {
					width: this.state.containerWidth,
					height: 'auto'
				};
			} else {
				imageStyle = {
					width: this.state.actualWidth,
					height: this.state.actualHeight
				};
			}
		}

		let cropper = null;
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
		
		let actions = null;
		if (model && this.state.containerWidth > 0) {
			let left = isNaN(imageStyle.width - 22) ? 0 : imageStyle.width - 22;
			actions = (
				<div className="image-actions" style={{left}}>
					<div className="action action-remove" onClick={this.removeFile}>
						<span className="fa fa-times"></span>
					</div>
					<div className="action action-edit" onClick={this.editFile.bind(this)}>
						<span className="fa fa-pencil"></span>
					</div>
				</div>
			);
		}

		let props = {
			onDrop: this.onDrop,
			onDragLeave: this.onDragLeave,
			onDragOver: this.onDragOver,
			style: {
				position: 'relative'
			}
		};

		return (
			<div {...props}>
				<div className={this.classSet(css)} onClick={this.getFiles}>
					{message || <img style={imageStyle} src={model.src} onLoad={this.readActualImageSize}/>}
					{actions}
				</div>
				<Webiny.Ui.Components.Form.Files.FileReader accept={this.props.accept} ref="reader" onChange={this.fileChanged}/>
				{cropper}
			</div>
		);
	}

	render() {
		let label = null;
		if (this.props.label) {
			label = <label className="control-label col-xs-4">{this.props.label}</label>;
		}

		if (this.props.label) {
			return (
				<div className={this.getComponentWrapperClass()}>
					<div className="form-group">
						{label}
						<div className="col-xs-8 plain-image">
							{this.renderImage()}
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className={this.classSet('col-xs-12 plain-image pn', this.props.className)}>
				{this.renderImage()}
			</div>
		);
	}
}

export default PlainImage;
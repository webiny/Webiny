import Component from './../../../../Lib/Core/Component';
import ApiService from './../../../../Lib/Api/Service';
import FileUploader from './FileUploader';

let placeholder = document.createElement('div');
placeholder.className = 'placeholder';
placeholder.textContent = 'Drop here';

class Images extends Component {

	constructor() {
		super();

		this.dragged = null;

		this.bindMethods(
			'saveImage',
			'renderImage',
			'applyCropping',
			'onCropperHidden',
			'filesChanged',
			'removeFile',
			'getFiles',
			'onDrop',
			'onDragOver',
			'onDragLeave',
			'getImageIndex'
		);

		this.state = {
			dragOver: false,
			images: [],
			cropImage: null,
			errors: []
		};
	}

	componentDidMount() {
		this.setupComponent(this.props);
		$(this.dom).magnificPopup({
			delegate: '.dz-details > img',
			type: 'image',
			gallery: {
				enabled: true
			},
			mainClass: 'mfp-fade'
		});
	}

	componentWillReceiveProps(props) {
		this.setupComponent(props);
	}

	setupComponent(props) {
		this.dom = ReactDOM.findDOMNode(this);
		this.api = new ApiService(props.api);
		this.uploader = new FileUploader(this.api);
		if (props.valueLink.value) {
			let images = props.valueLink.value.map(img => {
				img.key = Webiny.Tools.createUID();
				return img;
			});
			this.setState({images});
		}
	}

	getImageIndex(image) {
		let index = null;
		this.state.images.map((stateImage, stateIndex) => {
			if (stateImage.key == image.key) {
				index = stateIndex;
			}
		});
		return index;
	}

	saveImage(image) {
		let index = this.getImageIndex(image);
		let state = this.state;
		image.progress = 0;
		if (index != null) {
			_.set(state, 'images.' + index, image);
		} else {
			image.order = state.images.length;
			state.images.push(image);
		}

		this.uploader.upload(image, (percentage) => {
			let index = this.getImageIndex(image);
			let newState = this.state;
			newState.images[index].progress = percentage;
			this.setState({images: state.images});
		}, (newImage) => {
			let index = this.getImageIndex(image);
			let newState = this.state;
			newImage.key = image.key;
			newState.images[index] = newImage;
			this.props.valueLink.requestChange(state.images);
		});

		this.setState({images: state.images, cropImage: null});
	}

	applyCropping(newImage) {
		this.saveImage(newImage);
		this.setState({showCrop: false});
	}

	onCropperHidden() {
		this.setState({showCrop: false, cropImage: null});
	}

	filesChanged(files, errors) {
		if (errors && errors.length) {
			this.setState({errors});
		}

		if (files.length == 1) {
			let file = files[0];
			file.key = Webiny.Tools.createUID();
			this.setState({showCrop: true, cropImage: file});
			return;
		}

		files.map(img => {
			img.key = Webiny.Tools.createUID();
			this.saveImage(img);
		});
	}

	removeFile(image, e) {
		e.stopPropagation();
		let index = this.getImageIndex(image);
		this.api.delete(image.id).then(res => {
			if (res.getData() == true) {
				let state = this.state;
				state.images.splice(index, 1);
				this.props.valueLink.requestChange(state.images);
			}
		});
	}

	getFiles(e) {
		e.stopPropagation();
		this.refs.fileReader.getFiles();
	}

	onDragOver(e) {
		if (this.dragged) {
			return;
		}

		e.preventDefault();
		this.setState({
			dragOver: true
		});
	}

	onDragLeave(evt) {
		if (this.dragged) {
			return;
		}

		this.setState({
			dragOver: false
		});
	}

	onDrop(evt) {
		if (this.dragged) {
			evt.preventDefault();
			return;
		}

		evt.preventDefault();
		evt.persist();

		this.setState({
			dragOver: false
		});

		this.refs.fileReader.readFiles(evt.dataTransfer.files);
	}

	renderImage(image, index) {
		let editAction = null;
		let progress = null;


		let progressStyle = {
			marginTop: '30px !important',
			marginBottom: '6px',
			height: '20px'
		};

		if (!_.has(image, 'progress')) {
			let edit = (e) => {
				e.stopPropagation();
				this.setState({showCrop: true, cropImage: image, cropIndex: index});
			};
			editAction = (
				<div className="action action-edit" onClick={edit}>
					<span className="fa fa-pencil"></span>
				</div>
			);
		} else {
			progress = <Webiny.Ui.Components.Progress progress={image.progress} style={progressStyle}/>;
		}

		let removeAction = null;
		if (image.id) {
			removeAction = (
				<div className="action action-remove" onClick={(e) => {this.removeFile(image, e)}}>
					<span className="fa fa-times"></span>
				</div>
			);
		}

		let cacheBust = '';
		if (image.modifiedOn && image.src.indexOf('data:') == -1) {
			cacheBust = '?ts=' + moment(image.modifiedOn).format('X');
		}

		let props = {
			onClick: (e) => {
				e.stopPropagation()
			},
			'data-id': index,
			key: index,
			className: 'dz-preview dz-error dz-image-preview',
			draggable: true,
			onDragStart: (e) => {
				this.dragged = $(e.currentTarget).closest('.dz-image-preview')[0];

				e.dataTransfer.setDragImage(this.dragged, 10, 50);

				// Firefox requires calling dataTransfer.setData
				// for the drag to properly work
				e.dataTransfer.setData("text/html", this.dragged);
			},
			onDragEnd: (e) => {
				e.preventDefault();
				// Update state
				let data = this.state.images;
				let from = Number(this.dragged.dataset.id);
				let to = Number(this.over.dataset.id);
				if (from < to) {
					to--;
				}
				if (this.nodePlacement == "after") {
					to++;
				}

				this.dragged.style.display = "inline-block";
				if (this.dragged.parentNode == placeholder.parentNode) {
					this.dragged.parentNode.removeChild(placeholder);
				}
				this.dragged = null;

				data.splice(to, 0, data.splice(from, 1)[0]);
				data = data.map((item, index) => {
					item.order = index;
					return item;
				});
				this.props.valueLink.requestChange(data);
			},
			onDragOver: (e) => {
				e.preventDefault();
				this.dragged.style.display = "none";
				let over = $(e.target).closest('.dz-image-preview')[0];
				if (!over || $(over).hasClass("placeholder")) {
					return;
				}
				this.over = over;

				// Inside the dragOver method
				let relX = e.clientX - $(over).offset().left;
				let width = over.offsetWidth / 2;
				let parent = over.parentNode;

				if (relX > width) {
					this.nodePlacement = "after";
					parent.insertBefore(placeholder, over.nextElementSibling);
				}
				else if (relX < width) {
					this.nodePlacement = "before";
					parent.insertBefore(placeholder, over);
				}
			}
		};

		let size = filesize(image.size);
		if (image.src.indexOf('data:') > -1) {
			size = 'Uploading...';
		}

		return (
			<div {...props}>
				<div className="dz-details">
					<div className="dz-size">{size}</div>
					<img alt={image.name}
						 title={image.title || image.name}
						 src={image.src+cacheBust}
						 data-mfp-src={image.src+cacheBust}/>
				</div>
				<div className="image-actions">
					{removeAction}
					{editAction}
				</div>
				{progress}
			</div>
		);
	}

	getCropper() {
		let Form = Webiny.Ui.Components.Form;
		let cropper = this.props.newCropper;
		if (this.state.cropImage && this.state.cropImage.id) {
			cropper = this.props.editCropper;
		}
		return (
			<Webiny.Ui.Components.Form.Files.FileCropper
				title={cropper.title}
				action={cropper.action}
				onHidden={this.onCropperHidden}
				onCrop={this.applyCropping}
				config={cropper.config}
				image={this.state.cropImage}>
				<Form.Input context="vertical" label="Title" placeholder="Type in an image title"
							valueLink={this.linkState('cropImage.title')} componentWrapperClass="col-xs-12"/>
			</Webiny.Ui.Components.Form.Files.FileCropper>
		);
	}

	render() {
		let Alert = Webiny.Ui.Components.Alert;
		let model = this.state.images;

		let images = model.map(this.renderImage);
		let message = null;
		if (this.state.images.length == 0) {
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
			'dropzone dropzone-sm dz-clickable': true,
			'dz-drag-hover': this.state.dragOver
		};

		let props = {
			onDrop: this.onDrop,
			onDragLeave: this.onDragLeave,
			onDragOver: this.onDragOver,
			className: this.classSet(css),
			onClick: this.getFiles
		};

		let errors = null;
		if (this.state.errors) {
			errors = this.state.errors.map((err, index) => {
				return <div key={index}><strong>{err.name}</strong> {err.message}</div>;
			});
			errors = <Alert type="danger" onClose={() => {this.setState({errors: []})}}>{errors}</Alert>;
		}

		return (
			<div className="image-gallery">
				{errors}
				<div {...props}>
					{message}
					{images}
					<Webiny.Ui.Components.Form.Files.FileReader
						accept={this.props.accept}
						multiple={true}
						ref="fileReader"
						sizeLimit={this.props.sizeLimit}
						onChange={this.filesChanged}/>
					{this.getCropper()}
				</div>
			</div>
		);
	}
}

Images.defaultProps = {
	api: '/files',
	accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
	sizeLimit: 1048576,
	newCropper: {},
	editCropper: {},
	label: '',
	reference: null
};

export default Images;
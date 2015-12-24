import Component from './../../../Lib/Component';

class FileCropper extends Component {

	constructor() {
		super();
		this.bindMethods('applyCropping');
	}

	applyCropping() {
		var model = _.clone(this.props.image);
		var options = {};

		if (this.props.config.width && this.props.config.height) {
			options = {
				width: this.props.config.width,
				height: this.props.config.height
			};
		}

		model.src = this.cropper.cropper('getCroppedCanvas', options).toDataURL();
		this.props.onCrop(model);
	}

	render() {
		var props = this.props;
		if (!props.image) {
			return null;
		}

		var Modal = Rad.Components.Modal;
		var Button = Rad.Components.Form.Button;

		var modalProps = {
			onShown: (e) => {
				// Execute callback first
				props.onShown();

				// Initialize cropper plugin
				this.cropper = $(e.currentTarget).find('img#cropper');
				var data = props.config;
				this.cropper.cropper(data);
				if (data.width && data.height) {
					this.cropper.cropper('setCropBoxData', {
						width: data.width,
						heigt: data.height
					});
				}
			},
			onHidden: () => {
				props.onHidden();
				this.cropper.cropper('destroy');
				this.cropper = null;
			},
			closeOnClick: props.config.closeOnClick || props.closeOnClick,
			className: 's-modal cropper-dialog'
		};

		var cacheBust = '';
		if (props.image.modifiedOn && props.image.src.indexOf('data:') == -1) {
			cacheBust = '?ts=' + moment(props.image.modifiedOn).format('X');
		}

		return (
			<Modal.Dialog {...modalProps}>
				<Modal.Header>
					{props.title}
				</Modal.Header>
				<Modal.Body className="pln prn">
					{props.children}
					<div className="col-xs-12">
						<img id="cropper" width="100%" src={props.image.src+cacheBust}/>
					</div>
					<div className="clearfix"></div>
				</Modal.Body>
				<Modal.Footer>
					<Button type="primary" className="pull-right ml5" data-dismiss="modal"
							onClick={this.applyCropping}>{props.action}</Button>
				</Modal.Footer>
			</Modal.Dialog>
		);
	}
}

FileCropper.defaultProps = {
	config: {},
	title: 'Crop image',
	action: 'Apply cropping',
	show: false,
	closeOnClick: false,
	onCrop: _.noop,
	onShown: _.noop,
	onHidden: _.noop
};

/**
 * Config options
 * @see https://github.com/fengyuanchen/cropper
 */
var options = {
	aspectRatio: React.PropTypes.number,
	crop: React.PropTypes.func,
	preview: React.PropTypes.string,
	strict: React.PropTypes.bool,
	responsive: React.PropTypes.bool,
	checkImageOrigin: React.PropTypes.bool,
	background: React.PropTypes.bool,
	modal: React.PropTypes.bool,
	guides: React.PropTypes.bool,
	highlight: React.PropTypes.bool,
	autoCrop: React.PropTypes.bool,
	autoCropArea: React.PropTypes.number,
	dragCrop: React.PropTypes.bool,
	movable: React.PropTypes.bool,
	cropBoxMovable: React.PropTypes.bool,
	cropBoxResizable: React.PropTypes.bool,
	doubleClickToggle: React.PropTypes.bool,
	zoomable: React.PropTypes.bool,
	mouseWheelZoom: React.PropTypes.bool,
	touchDragZoom: React.PropTypes.bool,
	rotatable: React.PropTypes.bool,
	minContainerWidth: React.PropTypes.number,
	minContainerHeight: React.PropTypes.number,
	minCanvasWidth: React.PropTypes.number,
	minCanvasHeight: React.PropTypes.number,
	minCropBoxWidth: React.PropTypes.number,
	minCropBoxHeight: React.PropTypes.number,
	build: React.PropTypes.func,
	built: React.PropTypes.func,
	dragstart: React.PropTypes.func,
	dragmove: React.PropTypes.func,
	dragend: React.PropTypes.func,
	zoomin: React.PropTypes.func,
	zoomout: React.PropTypes.func
};

export default FileCropper;
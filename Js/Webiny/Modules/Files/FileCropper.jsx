import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class FileCropper extends Webiny.Ui.ModalComponent {

    constructor(props) {
        super(props);
        this.initialData = null;
        this.bindMethods('applyCropping');
    }

    applyCropping() {
        const model = _.clone(this.props.image);
        let options = {};

        if (this.props.config.width && this.props.config.height) {
            options = {
                width: this.props.config.width,
                height: this.props.config.height
            };
        }

        if (!_.isEqual(this.initialData, this.cropper.cropper('getData'))) {
            model.src = this.cropper.cropper('getCroppedCanvas', options).toDataURL();
        }

        this.props.onCrop(model);
    }

    componentDidMount() {
        super.componentDidMount();
        if (!this.props.image) {
            return this.hide();
        }

        this.show();
    }

    componentDidUpdate(prevProps) {
        super.componentDidUpdate();
        if (!prevProps.image && this.props.image) {
            return this.show();
        }

        if (prevProps.image && !this.props.image) {
            return this.hide();
        }
    }
}

FileCropper.defaultProps = {
    config: {},
    title: 'Crop image',
    action: 'Apply cropping',
    closeOnClick: false,
    onCrop: _.noop,
    onShown: _.noop,
    onHidden: _.noop,
    renderer() {
        const props = this.props;

        var modalProps = {
            onShown: () => {
                // Execute callback first
                props.onShown();
                // Initialize cropper plugin
                setTimeout(() => {
                    const data = props.config;
                    this.cropper = $('.img-cropper');
                    this.cropper.cropper(data);
                    if (data.width && data.height) {
                        this.cropper.cropper('setCropBoxData', {
                            width: data.width,
                            heigt: data.height
                        });
                    }
                    this.initialData = this.cropper.cropper('getData');
                });
            },
            onHidden: () => {
                props.onHidden();
                this.cropper.cropper('destroy');
                this.cropper = null;
            },
            closeOnClick: props.config.closeOnClick || props.closeOnClick,
            className: ''
        };

        let cacheBust = '';
        if (props.image && props.image.modifiedOn && props.image.src.indexOf('data:') == -1) {
            cacheBust = '?ts=' + moment(props.image.modifiedOn).format('X');
        }

        return (
            <Ui.Modal.Dialog ref="dialog" {...modalProps}>
                <Ui.Modal.Header title={props.title}/>
                <Ui.Modal.Body>
                    {props.children}
                    <div className="col-xs-12 no-padding">
                        <img className="img-cropper" width="100%" src={props.image && props.image.src+cacheBust}/>
                    </div>
                    <div className="clearfix"></div>
                </Ui.Modal.Body>
                <Ui.Modal.Footer>
                    <Ui.Button type="primary" className="pull-right ml5" data-dismiss="modal"
                               onClick={this.applyCropping}>{props.action}</Ui.Button>
                </Ui.Modal.Footer>
            </Ui.Modal.Dialog>
        );
    }
};

/**
 * Config options
 * @see https://github.com/fengyuanchen/cropper
 */
const options = {
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
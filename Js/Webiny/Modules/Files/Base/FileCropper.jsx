import Webiny from 'Webiny';

class FileCropper extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            height: 0
        };
        this.bindMethods('initCropper,getCacheBust,applyCropping,destroyCropper,getImage');
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        this.destroyCropper();
    }

    initCropper() {
        const data = _.cloneDeep(this.props.config);
        data.crop = e => {
            this.setState({width: Math.floor(e.width), height: Math.floor(e.height)});
        };
        this.cropper = $('.img-cropper');
        this.cropper.cropper(data);
        if (data.width && data.height) {
            this.cropper.cropper('setCropBoxData', {
                width: data.width,
                height: data.height
            });
        }
    }

    destroyCropper() {
        if (this.cropper) {
            this.cropper.cropper('destroy');
            this.cropper = null;
        }
    }

    getCacheBust() {
        let cacheBust = '';
        if (this.props.image && this.props.image.modifiedOn && this.props.image.src.indexOf('data:') === -1) {
            cacheBust = '?ts=' + moment(this.props.image.modifiedOn).format('X');
        }
        return cacheBust;
    }

    applyCropping() {
        this.props.onCrop(this.getImage());
    }

    getImage() {
        const model = _.clone(this.props.image);
        let options = {};

        if (this.props.config.width && this.props.config.height) {
            options = {
                width: this.props.config.width,
                height: this.props.config.height
            };
        }

        model.src = this.cropper.cropper('getCroppedCanvas', options).toDataURL();
        return model;
    }
}

FileCropper.defaultProps = {
    config: {},
    onCrop: _.noop
};

/* eslint-disable */
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
/* eslint-enable */

export default FileCropper;
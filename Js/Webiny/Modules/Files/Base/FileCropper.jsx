import Webiny from 'Webiny';

class FileCropper extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.initialData = null;
        this.bindMethods('initCropper,getCacheBust,applyCropping,destroyCropper');
    }

    initCropper() {
        const data = this.props.config;
        this.cropper = $('.img-cropper');
        this.cropper.cropper(data);
        if (data.width && data.height) {
            this.cropper.cropper('setCropBoxData', {
                width: data.width,
                heigt: data.height
            });
        }
        this.initialData = this.cropper.cropper('getData');
    }

    destroyCropper() {
        this.cropper.cropper('destroy');
        this.cropper = null;
    }

    getCacheBust() {
        let cacheBust = '';
        if (this.props.image && this.props.image.modifiedOn && this.props.image.src.indexOf('data:') === -1) {
            cacheBust = '?ts=' + moment(this.props.image.modifiedOn).format('X');
        }
        return cacheBust;
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
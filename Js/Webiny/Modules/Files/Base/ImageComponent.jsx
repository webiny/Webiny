import Webiny from 'Webiny';

class Image extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.lastId = null;

        this.bindMethods('applyCropping', 'onCropperHidden', 'fileChanged', 'removeFile', 'getFiles', 'readActualImageSize');

        _.merge(this.state, {
            error: null,
            showCrop: false,
            cropImage: {},
            actualWidth: 0,
            actualHeight: 0
        });
    }

    applyCropping(newImage) {
        this.props.valueLink.requestChange(newImage);
        this.setState({showCrop: false, cropImage: null});
    }

    onCropperHidden() {
        this.setState({showCrop: false});
    }

    fileChanged(file, error) {
        if (error) {
            this.setState({error});
            return;
        }

        if (_.has(file, 'src')) {
            file.id = _.get(this.props.valueLink.value, 'id', this.lastId);
            if (this.props.cropper) {
                this.setState({showCrop: true, cropImage: file});
            } else {
                this.props.valueLink.requestChange(file);
            }
        }
    }

    removeFile(e) {
        e.stopPropagation();
        this.lastId = this.props.valueLink.value && this.props.valueLink.value.id || null;
        this.props.valueLink.requestChange(null);
    }

    getFiles(e) {
        this.setState({error: null});
        if (e) {
            e.stopPropagation();
        }
        this.refs.reader.getFiles();
    }

    readActualImageSize(e) {
        const target = e.target;
        // Delay execution to allow DOM to be updated with image so we can get parent's width
        setTimeout(() => {
            this.setState({
                actualWidth: target.naturalWidth,
                actualHeight: target.naturalHeight,
                containerWidth: $(target).parent().outerWidth()
            });
        }, 30);
    }
}

Image.defaultProps = {
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    cropper: false,
    defaultImage: '',
    width: 250,
    height: 250
};

export default Image;
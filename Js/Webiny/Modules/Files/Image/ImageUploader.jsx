import Webiny from 'Webiny';
import ImageComponent from './../Base/ImageComponent';
const Ui = Webiny.Ui.Components;

class ImageUploader extends ImageComponent {

    constructor(props) {
        super(props);

        Webiny.Mixins.ApiComponent.extend(this);
        this.uploader = new Ui.Files.FileUploader(this.api);

        _.merge(this.state, {
            progress: null
        });

        this.bindMethods(
            'getCropper'
        );
    }

    renderError() {
        let error = null;
        if (this.state.error) {
            error = (
                <Ui.Alert type="error">{this.state.error.message}</Ui.Alert>
            );
        }
        return error;
    }

    applyCropping(image) {
        image.jobId = this.uploader.upload(image, (percentage) => {
            this.setState({progress: percentage});
        }, (newImage) => {
            this.props.onUploadSuccess(newImage);
            this.setState({progress: null});
        }, (apiResponse) => {
            this.props.onUploadFailure(apiResponse);
            this.setState({progress: null});
        });
    }

    getCropper(children = null) {
        const cropper = this.props.cropper;

        if (!cropper) {
            return null;
        }

        if (cropper.inline) {
            return (
                <Ui.Files.InlineFileCropper
                    title={cropper.title}
                    action={cropper.action}
                    onHidden={this.onCropperHidden}
                    onCrop={this.applyCropping}
                    config={cropper.config}
                    image={this.state.cropImage}>
                    {children}
                </Ui.Files.InlineFileCropper>
            );
        }

        return (
            <Ui.Files.ModalFileCropper
                title={cropper.title}
                action={cropper.action}
                onHidden={this.onCropperHidden}
                onCrop={this.applyCropping}
                config={cropper.config}
                image={this.state.cropImage}>
                {children}
            </Ui.Files.ModalFileCropper>
        );
    }
}

ImageUploader.defaultProps = {
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 2485760,
    type: 'primary',
    label: 'Upload image',
    api: '/entities/core/files',
    onUploadSuccess: _.noop,
    onUploadFailure: _.noop,
    renderer() {
        const props = {
            onClick: this.getFiles,
            type: this.props.type
        };

        const label = this.state.progress ? 'Uploading...' + this.state.progress + '%' : this.props.label;

        return (
            <div>
                {this.renderError()}
                <Ui.Button {...props}>{label}</Ui.Button>

                <Ui.Files.FileReader
                    accept={this.props.accept}
                    ref="reader"
                    sizeLimit={this.props.sizeLimit}
                    onChange={this.fileChanged}/>
                {this.getCropper()}
            </div>
        );
    }
};

export default ImageUploader;
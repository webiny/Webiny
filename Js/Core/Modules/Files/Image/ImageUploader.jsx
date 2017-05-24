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
        this.uploader.upload(image, (percentage) => {
            this.setState({progress: percentage});
        }, (newImage) => {
            this.props.onUploadSuccess(newImage);
            this.setState({progress: null});
        }, (apiResponse) => {
            this.props.onUploadFailure(apiResponse);
            this.setState({progress: null});
        });
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
            type: this.props.type,
            disabled: this.state.progress !== null
        };

        const description = this.props.description ? <span className="help-block">{this.props.description}</span> : null;
        const label = this.state.progress ? 'Uploading...' + this.state.progress + '%' : this.props.label;

        return (
            <div>
                {this.renderError()}
                <Ui.Button {...props}>{label}</Ui.Button>
                {description}

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
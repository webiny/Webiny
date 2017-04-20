import Webiny from 'Webiny';

class ImageUploader extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);

        this.lastId = null;

        this.bindMethods(
            'onCropperHidden',
            'fileChanged',
            'getFiles',
            'getCropper',
            'uploadImage'
        );

        _.assign(this.state, {
            progress: null,
            error: null,
            cropImage: null,
            actualWidth: 0,
            actualHeight: 0
        });

        Webiny.Mixins.ApiComponent.extend(this);
        this.uploader = new Webiny.Api.Uploader(this.api);
    }

    uploadImage(image) {
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

    onCropperHidden() {
        this.setState({cropImage: null});
    }

    fileChanged(file, error) {
        if (error) {
            this.setState({error});
            return;
        }

        if (_.has(file, 'src')) {
            file.id = _.get(this.props, 'value.id', this.lastId);
            if (this.props.cropper) {
                this.setState({cropImage: file});
            } else {
                this.uploadImage(file);
            }
        }
    }

    getFiles(e) {
        this.setState({error: null});
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.refs.reader.getFiles();
    }

    getCropper() {
        const {cropper, Cropper} = this.props;

        if (!cropper) {
            return null;
        }

        if (cropper.inline) {
            return (
                <Cropper.Inline
                    title={cropper.title}
                    action={cropper.action}
                    onHidden={this.onCropperHidden}
                    onCrop={this.uploadImage}
                    config={cropper.config}
                    image={this.state.cropImage}/>
            );
        }

        return (
            <Cropper.Modal
                title={cropper.title}
                action={cropper.action}
                onHidden={this.onCropperHidden}
                onCrop={this.uploadImage}
                config={cropper.config}
                image={this.state.cropImage}/>
        );
    }

    renderError() {
        let error = null;
        if (this.state.error) {
            const {Alert} = this.props;
            error = (
                <Alert type="error">{this.state.error.message}</Alert>
            );
        }
        return error;
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

        const {Button, FileReader} = this.props;

        const description = this.props.description ? <span className="help-block">{this.props.description}</span> : null;
        const label = this.state.progress ? 'Uploading...' + this.state.progress + '%' : this.props.label;

        return (
            <div>
                {this.renderError()}
                <Button {...props}>{label}</Button>
                {description}

                <FileReader
                    accept={this.props.accept}
                    ref="reader"
                    sizeLimit={this.props.sizeLimit}
                    onChange={this.fileChanged}/>
                {this.getCropper()}
            </div>
        );
    }
};

export default Webiny.createComponent(ImageUploader, {modules: ['Alert', 'Button', 'FileReader', 'Cropper']});
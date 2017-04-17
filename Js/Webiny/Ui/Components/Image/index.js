import Webiny from 'Webiny';
import ImagePreview from './Preview';
import galleryStyles from './Gallery.css';

class Image extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.lastId = null;

        this.bindMethods(
            'applyCropping',
            'onCropperHidden',
            'fileChanged',
            'editFile',
            'removeFile',
            'getFiles',
            'getCropper',
            'onDrop',
            'onDragOver',
            'onDragLeave'
        );

        _.merge(this.state, {
            error: null,
            cropImage: null,
            actualWidth: 0,
            actualHeight: 0
        });
    }

    applyCropping(newImage) {
        this.props.onChange(newImage).then(() => this.setState({cropImage: null}));
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
                this.props.onChange(file);
            }
        }
    }

    editFile() {
        this.setState({
            cropImage: this.props.value
        });
    }

    removeFile(e) {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.lastId = this.props.value && this.props.value.id || null;
        this.props.onChange(null);
    }

    getFiles(e) {
        this.setState({error: null});
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }
        this.refs.reader.getFiles();
    }

    getCropper(children = null) {
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
                    onCrop={this.applyCropping}
                    config={cropper.config}
                    image={this.state.cropImage}>
                    {children}
                </Cropper.Inline>
            );
        }

        return (
            <Cropper.Modal
                title={cropper.title}
                action={cropper.action}
                onHidden={this.onCropperHidden}
                onCrop={this.applyCropping}
                config={cropper.config}
                image={this.state.cropImage}>
                {children}
            </Cropper.Modal>
        );
    }

    onDragOver(e) {
        e.preventDefault();
        this.setState({
            dragOver: true
        });
    }

    onDragLeave() {
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

Image.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    cropper: false,
    sizeLimit: 2485760,
    renderer() {
        if (this.state.cropImage && _.get(this.props, 'cropper.inline', false)) {
            return this.getCropper();
        }

        let message = null;
        if (!this.props.value) {
            message = (
                <div>
                    <span className={galleryStyles.mainText}>DRAG FILES HERE</span>
                </div>
            );
        }

        const props = {
            onDrop: this.onDrop,
            onDragLeave: this.onDragLeave,
            onDragOver: this.onDragOver,
            onClick: this.getFiles
        };

        let css = this.classSet(
            galleryStyles.trayBin,
            galleryStyles.trayBinEmpty
        );

        if (this.props.value) {
            css = this.classSet(galleryStyles.trayBin);
        }

        let image = null;
        if (this.props.value) {
            const imageProps = {
                image: this.props.value,
                onEdit: this.editFile,
                onDelete: this.removeFile,
                onDragStart: this.onImageDragStart,
                onDragEnd: this.onImageDragEnd,
                onDragOver: this.onImageDragOver
            };

            image = (
                <ImagePreview {...imageProps}/>
            );
        }

        const {FileReader} = this.props;

        return (
            <div className="form-group">
                <div className={this.classSet(css)} {...props}>
                    {this.renderError()}
                    <div className={galleryStyles.container}>
                        {message}
                        {image}
                        <FileReader
                            ref="reader"
                            accept={this.props.accept}
                            sizeLimit={this.props.sizeLimit}
                            onChange={this.fileChanged}/>
                    </div>
                    <div className={galleryStyles.uploadAction}>
                        <span>Dragging not convenient?</span>&nbsp;
                        <a href="#" onClick={this.getFiles}>SELECT FILES HERE</a>
                    </div>
                </div>
                {this.getCropper()}
            </div>
        );
    }
});

export default Webiny.createComponent(Image, {modules: ['FileReader', 'Alert', 'Cropper']});
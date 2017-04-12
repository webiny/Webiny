import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ImageComponent extends Webiny.Ui.FormComponent {

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
            'getCropper'
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
    
    getFileReader(props) {
        return <Ui.Files.FileReader ref="reader" {...props}/>
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

ImageComponent.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    cropper: false
});

export default ImageComponent;
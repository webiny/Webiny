import Webiny from 'Webiny';
import ImageComponent from './../Base/ImageComponent';
const Ui = Webiny.Ui.Components;

class Avatar extends ImageComponent {

    constructor(props) {
        super(props);

        this.bindMethods(
            'onDrop',
            'onDragOver',
            'onDragLeave'
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
            error = (
                <Ui.Alert type="error" icon={null}>{this.state.error.message}</Ui.Alert>
            );
        }
        return error;
    }
}

Avatar.defaultProps = {
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    cropper: false,
    defaultImage: '',
    width: 250,
    height: 250,
    empty: 'x',
    renderer() {
        const model = this.props.valueLink.value;

        let imageSrc = this.props.defaultImage;
        if (model) {
            imageSrc = model.src;
        }

        const imageAction = (
            <button type="button" className="btn btn-primary btn-block upload" onClick={this.getFiles}>Upload</button>
        );

        let cropper = null;
        if (this.props.cropper) {
            cropper = (
                <Ui.Files.ModalFileCropper
                    title={this.props.cropper.title}
                    action={this.props.cropper.action}
                    onHidden={this.onCropperHidden}
                    onCrop={this.applyCropping}
                    config={this.props.cropper.config}
                    image={this.state.cropImage}/>
            );
        }

        const props = {
            onDrop: this.onDrop,
            onDragLeave: this.onDragLeave,
            onDragOver: this.onDragOver,
            onClick: this.getFiles,
            className: 'avatar'
        };

        return (
            <div>
                <div {...props}>
                    {this.renderError()}
                    <span className="avatar-placeholder">
                        {imageSrc ? <img src={imageSrc} className="avatar img-responsive" height="157" width="157"/> : this.props.empty}
                    </span>
                    {imageAction}
                    <span className="small-txt">JPG, PNG, GIF</span>
                    <Ui.Files.FileReader accept={this.props.accept} ref="reader" onChange={this.fileChanged}/>
                    {cropper}
                </div>
            </div>
        );
    }
};

export default Avatar;
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import ImageComponent from './../Base/ImageComponent';

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
            error = <h4>{this.state.error.message}</h4>;
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

        const name = _.get(model, 'name', '');

        const imageAction = (
            <button type="button" className="btn btn-primary btn-block upload" onClick={this.getFiles}>Upload</button>
        );

        let cropper = null;
        if (this.props.cropper && this.state.showCrop) {
            cropper = (
                <Ui.Files.ModalFileCropper
                    title={this.props.cropper.title}
                    action={this.props.cropper.action}
                    onHidden={this.onCropperHidden}
                    onCrop={this.applyCropping}
                    config={this.props.cropper.config}
                    image={this.state.cropImage}
                    />
            );
        }

        let props = {
            onDrop: this.onDrop,
            onDragLeave: this.onDragLeave,
            onDragOver: this.onDragOver,
            onClick: this.getFiles,
            className: 'edit-avatar'
        };

        return (
            <div>
                {this.renderError()}
                <div {...props}>
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
import Webiny from 'Webiny';
import ImageComponent from './../Base/ImageComponent';
import styles from './styles/Avatar.css';
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

Avatar.defaultProps = _.merge({}, ImageComponent.defaultProps, {
    defaultImage: null,
    empty: 'x',
    renderer() {
        const model = this.props.value;

        let imageSrc = this.props.defaultImage;
        if (model) {
            imageSrc = model.src;
        }

        const imageAction = <Ui.Button
            type="primary"
            icon="fa-upload"
            onClick={this.getFiles}
            className={styles.uploadBtn}>Upload</Ui.Button>;

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
            className: styles.avatar
        };

        return (
            <div>
                <div {...props}>
                    {this.renderError()}
                    <span className={styles.placeholder}>
                        {imageSrc ? <img src={imageSrc} className={styles.image} height="157" width="157"/> : this.props.empty}
                    </span>
                    {imageAction}
                    <span className={styles.smallText}>JPG, PNG, GIF</span>
                    {this.getFileReader({accept: this.props.accept, onChange: this.fileChanged})}
                    {cropper}
                </div>
            </div>
        );
    }
});

export default Avatar;
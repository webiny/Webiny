import Webiny from 'Webiny';
import moment from 'moment';
import filesize from 'filesize';
import styles from './styles/Gallery.css';
const Ui = Webiny.Ui.Components;

class Image extends Webiny.Ui.Component {

    constructor(props) {
        super(props);

        this.bindMethods('editImage', 'deleteImage');
    }

    editImage(e) {
        e.stopPropagation();
        this.props.onEdit();
    }

    deleteImage(e) {
        e.stopPropagation();
        this.props.onDelete();
    }
}

Image.defaultProps = {
    renderer() {
        const image = this.props.image;
        const title = image.title || image.name || '';
        let cacheBust = '';
        if (image.modifiedOn && image.src.indexOf('data:') === -1) {
            cacheBust = '?ts=' + moment(image.modifiedOn).format('X');
        }

        const draggable = {
            'data-id': this.props.index,
            draggable: true,
            onDragStart: this.props.onDragStart,
            onDragEnd: this.props.onDragEnd,
            onDragOver: this.props.onDragOver
        };

        let editBtn = null;
        if (!_.has(image, 'progress')) {
            editBtn = <Ui.Link onClick={this.editImage} className={styles.fileEdit}/>;
        }

        return (
            <div className={styles.file} {...draggable} data-role="image">
                <img className={styles.filePreview} src={image.src + cacheBust} alt={title} title={title} width="133" height="133"/>
                {editBtn}
                <Ui.Link onClick={this.deleteImage} className={styles.fileRemove}/>
                <span className={styles.fileName}>{image.name}</span>
                <span className={styles.fileSize}>{image.id ? filesize(image.size) : '-'}</span>
            </div>
        );
    }
};

export default Image;
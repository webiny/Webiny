import Webiny from 'Webiny';
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
        if (_.has(this.props.image, 'progress')) {
            this.props.onCancelUpload();
        } else {
            this.props.onDelete();
        }
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
            editBtn = <Ui.Link onClick={this.editImage} className="tray-bin__file-edit"/>;
        }

        return (
            <div className="tray-bin__file" {...draggable} data-role="image">
                <img className="tray-bin__file-preview" src={image.src + cacheBust} alt={title} title={title} width="133" height="133"/>
                {editBtn}
                <Ui.Link onClick={this.deleteImage} className="tray-bin__file-remove"/>
                <span className="tray-bin__file-name">{image.name}</span>
                <span className="tray-bin__file-size">{_.has(image, 'progress') ? image.progress + '%' : filesize(image.size)}</span>
            </div>
        );
    }
};

export default Image;
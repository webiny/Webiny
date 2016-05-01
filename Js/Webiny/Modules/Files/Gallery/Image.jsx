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

        return (
            <div className="file" {...draggable}>
                <img className="file-preview" src={image.src+cacheBust} alt={title} title={title} width="133" height="133"/>
                <Ui.Link onClick={this.editImage} className="file-edit"/>
                <Ui.Link onClick={this.deleteImage} className="file-remove"/>
                <span className="file-name">{image.name}</span>
                <span className="file-size">{filesize(image.size)}</span>
            </div>
        );
    }
};

export default Image;
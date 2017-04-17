import Webiny from 'Webiny';
import moment from 'moment';

class ImagePreview extends Webiny.Ui.Component {

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
        this.props.onDelete(e);
    }
}

ImagePreview.defaultProps = {
    renderer() {
        const {image, Link} = this.props;
        let cacheBust = '';
        if (image.modifiedOn && image.src.indexOf('data:') === -1) {
            cacheBust = '?ts=' + moment(image.modifiedOn).format('X');
        }

        return (
            <div className="tray-bin__file" style={{float: 'none'}}>
                <img className="tray-bin__file-preview" src={image.src + cacheBust} style={{width: '100%'}}/>
                <Link onClick={this.editImage} className="tray-bin__file-edit"/>
                <Link onClick={this.deleteImage} className="tray-bin__file-remove"/>
            </div>
        );
    }
};

export default Webiny.createComponent(ImagePreview, {modules: ['Link']});
import React from 'react';
import Webiny from 'Webiny';
import moment from 'moment';
import styles from './styles.css';

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
        const {image, Link, styles} = this.props;
        let cacheBust = '';
        if (image.modifiedOn && image.src.indexOf('data:') === -1) {
            cacheBust = '?ts=' + moment(image.modifiedOn).format('X');
        }

        return (
            <div className={styles.file} style={{float: 'none'}}>
                <img className={styles.filePreview} src={image.src + cacheBust} style={{width: '100%'}}/>
                {this.props.onEdit ? <Link onClick={this.editImage} className={styles.fileEdit}/> : null}
                <Link onClick={this.deleteImage} className={styles.fileRemove}/>
            </div>
        );
    }
};

export default Webiny.createComponent(ImagePreview, {modules: ['Link'], styles});
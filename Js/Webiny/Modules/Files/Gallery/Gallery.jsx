import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import ImageComponent from './../Base/ImageComponent';
import Image from './Image';

const placeholder = document.createElement('div');
placeholder.className = 'tray-bin__file placeholder';
placeholder.textContent = 'Drop here';

class Gallery extends ImageComponent {

    constructor(props) {
        super(props);

        this.dragged = null;

        this.bindMethods(
            'saveImage',
            'applyCropping',
            'onCropperHidden',
            'filesChanged',
            'deleteImage',
            'getFiles',
            'onDrop',
            'onDragOver',
            'onImageDragOver',
            'onImageDragStart',
            'onImageDragEnd',
            'onDragLeave',
            'getImageIndex'
        );

        _.assign(this.state, {
            images: [],
            dragOver: false,
            cropImage: null,
            errors: null
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.setupComponent(this.props);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        this.setupComponent(props);
    }

    setupComponent(props) {
        this.dom = ReactDOM.findDOMNode(this);
        if (props.value) {
            const images = props.value.map(img => {
                img.key = _.uniqueId('image-');
                return img;
            });
            this.setState({images});
        }
    }

    getImageIndex(image) {
        let index = null;
        this.state.images.map((stateImage, stateIndex) => {
            if (stateImage.key === image.key) {
                index = stateIndex;
            }
        });
        return index;
    }

    saveImage(image) {
        const numberOfImages = _.get(this.props, 'value.length', 0) + 1;
        // Show error message if maximum images limit is reached and the image being saved does not yet exists in the gallery
        if (this.props.maxImages && numberOfImages > this.props.maxImages && !_.find(this.props.value, {name: image.name})) {
            const errors = this.state.errors || [];
            errors.push({name: image.name, message: this.props.maxImagesMessage});
            this.setState({errors});
            return;
        }

        const index = this.getImageIndex(image);
        const state = this.state;
        if (index !== null) {
            _.set(state, 'images.' + index, image);
        } else {
            image.order = state.images.length;
            state.images.push(image);
        }
        this.props.onChange(state.images);
    }

    applyCropping(newImage) {
        this.setState({cropImage: null}, () => {
            this.saveImage(newImage);
        });
    }

    onCropperHidden() {
        this.setState({cropImage: null});
    }

    filesChanged(files, errors) {
        if (errors && errors.length) {
            this.setState({errors});
        } else {
            this.setState({errors: null});
        }

        if (files.length === 1) {
            const file = files[0];
            file.key = _.uniqueId('image-');
            if (this.props.newCropper) {
                return this.setState({cropImage: file});
            }

            return this.setState({cropImage: null}, () => {
                this.saveImage(file);
            });
        }

        files.map(img => {
            img.key = _.uniqueId('image-');
            this.saveImage(img);
        });
    }

    getFiles(e) {
        e.stopPropagation();
        this.refs.reader.getFiles();
    }

    onDragOver(e) {
        if (this.dragged) {
            return;
        }

        e.preventDefault();
        this.setState({
            dragOver: true
        });
    }

    onDragLeave() {
        if (this.dragged) {
            return;
        }

        this.setState({
            dragOver: false
        });
    }

    onDrop(e) {
        if (this.dragged) {
            e.preventDefault();
            return;
        }

        e.preventDefault();
        e.persist();

        this.setState({
            dragOver: false
        });

        this.refs.reader.readFiles(e.dataTransfer.files);
    }

    editImage(image, index) {
        this.setState({cropImage: image, cropIndex: index});
    }

    deleteImage(image, index) {
        const state = this.state;
        state.images.splice(index, 1);
        state.images = state.images.map((item, i) => {
            item.order = i;
            return item;
        });
        this.props.onChange(state.images);
    }

    onImageDragStart(e) {
        this.dragged = $(e.currentTarget).closest('[data-role="image"]')[0];
        e.dataTransfer.setDragImage(this.dragged, 10, 50);
        // Firefox requires calling dataTransfer.setData for the drag to properly work
        e.dataTransfer.setData('text/html', this.dragged);
    }

    onImageDragEnd(e) {
        e.preventDefault();
        // Update state
        let data = this.state.images;
        const from = Number(this.dragged.dataset.id);
        let to = Number(this.over.dataset.id);
        if (from < to) {
            to--;
        }
        if (this.nodePlacement === 'after') {
            to++;
        }

        this.dragged.style.display = 'inline-block';
        if (this.dragged.parentNode === placeholder.parentNode) {
            this.dragged.parentNode.removeChild(placeholder);
        }
        this.dragged = null;

        data.splice(to, 0, data.splice(from, 1)[0]);
        data = data.map((item, index) => {
            item.order = index;
            return item;
        });
        this.props.onChange(data);
    }

    onImageDragOver(e) {
        if (!this.dragged) {
            return;
        }
        e.preventDefault();
        this.dragged.style.display = 'none';
        const over = $(e.target).closest('[data-role="image"]')[0];
        if (!over || $(over).hasClass('placeholder')) {
            return;
        }
        this.over = over;

        // Inside the dragOver method
        const relX = e.clientX - $(over).offset().left;
        const width = over.offsetWidth / 2;
        const parent = over.parentNode;

        if (relX > width) {
            this.nodePlacement = 'after';
            parent.insertBefore(placeholder, over.nextElementSibling);
        } else if (relX < width) {
            this.nodePlacement = 'before';
            parent.insertBefore(placeholder, over);
        }
    }

    getCropper(children = null) {
        let cropper = this.props.newCropper;
        if (this.state.cropImage && this.state.cropImage.id) {
            cropper = this.props.editCropper;
        }

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

Gallery.defaultProps = {
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 10000000,
    maxImages: null,
    maxImagesMessage: 'Maximum number of images reached!',
    newCropper: {},
    editCropper: {},
    renderer() {
        let message = null;
        if (this.state.images.length === 0) {
            message = (
                <div className="dz-default dz-message">
                    <span className="tray-bin__main-text">DRAG FILES HERE</span>
                </div>
            );
        }

        const props = {
            onDrop: this.onDrop,
            onDragLeave: this.onDragLeave,
            onDragOver: this.onDragOver,
            onClick: this.getFiles
        };

        const css = {
            'tray-bin': true,
            'tray-bin--empty': !this.state.images.length
        };

        let errors = null;
        if (this.state.errors) {
            const data = [];
            _.each(this.state.errors, (err, key) => {
                data.push(<li key={key}><strong>{err.name}</strong>: {err.message}</li>);
            });

            errors = (
                <Ui.Alert title="Some files could not be added to the gallery" type="error">
                    {data && <ul>{data}</ul>}
                </Ui.Alert>
            );
        }

        return (
            <div className="form-group">
                <div className={this.classSet(css)}>
                    {errors}
                    <div className="tray-bin__container" {...props}>
                        {message}
                        {this.state.images.map((item, index) => {
                            const imageProps = {
                                key: item.id || index,
                                index,
                                image: item,
                                onEdit: () => this.editImage(item, index),
                                onDelete: () => {
                                    this.deleteImage(item, index);
                                },
                                onDragStart: this.onImageDragStart,
                                onDragEnd: this.onImageDragEnd,
                                onDragOver: this.onImageDragOver
                            };

                            return <Image {...imageProps}/>;
                        })}
                        <Ui.Files.FileReader
                            accept={this.props.accept}
                            multiple={true}
                            ref="reader"
                            sizeLimit={this.props.sizeLimit}
                            onChange={this.filesChanged}/>
                        {this.getCropper(
                            <Ui.Input label="Title" placeholder="Type in an image title" {...this.bindTo('cropImage.title')}/>
                        )}
                    </div>
                    <div className="txt_b">
                        <span>Dragging not convenient?</span>&nbsp;
                        <a href="#" onClick={this.getFiles}>SELECT FILES HERE</a>
                    </div>
                </div>
            </div>
        );
    }
};

export default Gallery;
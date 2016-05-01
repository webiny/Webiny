import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;
import FileUploader from './../FileUploader';
import ImageComponent from './../Base/ImageComponent';
import Image from './Image';

const placeholder = document.createElement('div');
placeholder.className = 'placeholder';
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
            dragOver: false,
            images: [],
            cropImage: null,
            errors: []
        });

        Webiny.Mixins.ApiComponent.extend(this);
        this.uploader = new FileUploader(this.api);
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
        if (props.valueLink.value) {
            let images = props.valueLink.value.map(img => {
                img.key = Webiny.Tools.createUID();
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
        const index = this.getImageIndex(image);
        const state = this.state;
        image.progress = 0;
        if (index != null) {
            _.set(state, 'images.' + index, image);
        } else {
            image.order = state.images.length;
            state.images.push(image);
        }

        this.uploader.upload(image, (percentage) => {
            const newState = this.state;
            newState.images[this.getImageIndex(image)].progress = percentage;
            this.setState({images: state.images});
        }, (newImage) => {
            const newState = this.state;
            newImage.key = image.key;
            newState.images[this.getImageIndex(image)] = newImage;
            this.props.valueLink.requestChange(state.images);
        });

        this.setState({images: state.images, cropImage: null});
    }

    applyCropping(newImage) {
        this.saveImage(newImage);
        this.setState({showCrop: false});
    }

    onCropperHidden() {
        this.setState({showCrop: false, cropImage: null});
    }

    filesChanged(files, errors) {
        if (errors && errors.length) {
            this.setState({errors});
        }

        if (files.length === 1) {
            const file = files[0];
            file.key = Webiny.Tools.createUID();
            this.setState({showCrop: true, cropImage: file});
            return;
        }

        files.map(img => {
            img.key = Webiny.Tools.createUID();
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
        this.setState({showCrop: true, cropImage: image, cropIndex: index});
    }

    deleteImage(image, index) {
        this.api.delete(image.id).then(res => {
            if (res.getData() === true) {
                const state = this.state;
                state.images.splice(index, 1);
                this.props.valueLink.requestChange(state.images);
                Webiny.Growl.success(<span>Image <strong>{image.name}</strong> deleted succesfully!</span>, 'Gallery');
            }
        });
    }

    onImageDragStart(e) {
        this.dragged = $(e.currentTarget).closest('.file')[0];
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
        if (this.dragged.parentNode == placeholder.parentNode) {
            this.dragged.parentNode.removeChild(placeholder);
        }
        this.dragged = null;

        data.splice(to, 0, data.splice(from, 1)[0]);
        data = data.map((item, index) => {
            item.order = index;
            return item;
        });
        this.props.valueLink.requestChange(data);
    }

    onImageDragOver(e) {
        if (!this.dragged) {
            return;
        }
        e.preventDefault();
        this.dragged.style.display = 'none';
        const over = $(e.target).closest('.file')[0];
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
        }
        else if (relX < width) {
            this.nodePlacement = 'before';
            parent.insertBefore(placeholder, over);
        }
    }

    getCropper() {
        let cropper = this.props.newCropper;
        if (this.state.cropImage && this.state.cropImage.id) {
            cropper = this.props.editCropper;
        }
        return (
            <Ui.Files.FileCropper
                title={cropper.title}
                action={cropper.action}
                onHidden={this.onCropperHidden}
                onCrop={this.applyCropping}
                config={cropper.config}
                image={this.state.cropImage}>
                <Ui.Input label="Title" placeholder="Type in an image title" valueLink={this.bindTo('cropImage.title')}/>
            </Ui.Files.FileCropper>
        );
    }
}

Gallery.defaultProps = {
    api: '/entities/core/files',
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 10000000,
    newCropper: {},
    editCropper: {},
    confirmDelete: false,
    renderer() {
        let message = null;
        if (this.state.images.length === 0) {
            message = (
                <div>
                    <div className="dz-default dz-message">
                        <span className="main-text">DRAG FILES HERE</span>
                        <i className="demo-icon icon-upload-icon"></i>
                    </div>
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
            'step-3': this.state.images.length > 0
        };

        /*let errors = null;
         if (this.state.errors) {
         errors = this.state.errors.map((err, index) => {
         return <div key={index}><strong>{err.name}</strong> {err.message}</div>;
         });
         }*/

        const confirmationProps = {
            ref: 'confirm',
            title: 'Delete confirmation',
            message: 'This action is not reversable. Delete this image?',
            onConfirm: (image, index, modal) => {
                modal.hide();
                this.deleteImage(image, index);
            }
        };

        return (
            <div className={this.classSet(css)} {...props}>
                {message}
                <div>
                    {this.state.images.map((item, index) => {
                        const imageProps = {
                            key: item.id || index,
                            index,
                            image: item,
                            onEdit: () => this.editImage(item, index),
                            onDelete: () => {
                                if (this.props.confirmDelete) {
                                    this.refs.confirm.setData(item, index).show();
                                } else {
                                    this.deleteImage(item, index)
                                }
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
                    {this.getCropper()}
                </div>
                <Ui.Modal.Confirmation {...confirmationProps}/>
            </div>
        );
    }
};

export default Gallery;
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HtmlEditor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);

        this.editor = null;

        this.toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block', 'link', 'image'],

            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent

            [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
            [{'header': [1, 2, 3, 4, 5, 6, false]}],

            [{'color': []}, {'background': []}],          // dropdown with defaults from theme
            [{'font': []}],
            [{'align': []}],

            ['clean']                                         // remove formatting button
        ];

        this.api = new Webiny.Api.Endpoint(props.imageApi);
        this.uploader = new Ui.Files.FileUploader(this.api);

        _.merge(this.state, {
            cropImage: null,
            uploadPercentage: null
        });

        this.bindMethods('getTextareaElement,getEditor,getCropper,onCropperHidden,uploadImage,fileChanged');
    }

    componentDidMount() {
        super.componentDidMount();

        this.editor = new Quill(this.getTextareaElement(), {
            modules: {
                toolbar: this.toolbarOptions
            },
            theme: 'snow',
            bounds: document.body
        });

        const toolbar = this.editor.getModule('toolbar');
        toolbar.addHandler('image', () => {
            this.refs.reader.getFiles();
        });

        this.editor.on('text-change', () => {
            const contents = this.editor.root.innerHTML;
            this.props.valueLink.requestChange(contents);
        });

        this.editor.pasteHTML(this.props.valueLink.value);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (props.valueLink.value != this.props.valueLink.value) {
            this.editor.pasteHTML(props.valueLink.value);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const imageChanges = nextState.cropImage != this.state.cropImage || nextState.uploadPercentage != this.state.uploadPercentage;
        return !_.isEqual(nextProps.children, this.props.children) || imageChanges;
    }

    componentWillUnmount() {
        delete this.editor;
    }

    fileChanged(file, error) {
        if (error) {
            this.setState({error});
            return;
        }

        if (this.props.cropper) {
            this.setState({cropImage: file});
        } else {
            this.uploadImage(file);
        }
    }

    uploadImage(data) {
        this.uploader.upload(data, (percentage) => {
            this.setState({uploadPercentage: percentage});
        }, file => {
            this.editor.insertEmbed(this.editor.getSelection(true).index, 'image', file.src);
            this.setState({uploadPercentage: null});
        });
    }

    getCropper(children = null) {
        const cropper = this.props.cropper;

        if (!cropper) {
            return null;
        }

        if (cropper.inline) {
            return (
                <Ui.Files.InlineFileCropper
                    title={cropper.title}
                    action={cropper.action}
                    onHidden={this.onCropperHidden}
                    onCrop={this.uploadImage}
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
                onCrop={this.uploadImage}
                config={cropper.config}
                image={this.state.cropImage}>
                {children}
            </Ui.Files.ModalFileCropper>
        );
    }

    onCropperHidden() {
        this.setState({cropImage: null});
    }

    getEditor() {
        return this.editor;
    }

    getTextareaElement() {
        return ReactDOM.findDOMNode(this).querySelector('.editor');
    }
}

HtmlEditor.defaultProps = {
    imageApi: '/entities/core/images',
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 2485760,
    cropper: {
        title: 'Crop your image',
        action: 'Insert image',
        config: {
            closeOnClick: false,
            autoCropArea: 0.7,
            guides: false,
            strict: true,
            mouseWheelZoom: true,
            touchDragZoom: false
        }
    },
    renderer() {
        let uploader = null;
        if (this.state.uploadPercentage != null) {
            uploader = (
                <div>
                    <strong>Your image is being uploaded...</strong>
                    <Ui.Progress value={this.state.uploadPercentage}/>
                </div>
            );
        }

        return (
            <div>
                {uploader}
                <div className="editor"></div>
                <Ui.Files.FileReader
                    accept={this.props.accept}
                    ref="reader"
                    sizeLimit={this.props.sizeLimit}
                    onChange={this.fileChanged}/>
                {this.getCropper(<Ui.Alert type="info" title="Hint">Scroll to zoom in/out</Ui.Alert>)}
            </div>
        );
    }
};

export default HtmlEditor;

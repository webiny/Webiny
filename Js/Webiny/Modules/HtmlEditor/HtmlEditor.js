import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HtmlEditor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);


        this.editor = null;
        this.delay = null;
        this.api = new Webiny.Api.Endpoint(props.imageApi);
        this.uploader = new Ui.Files.FileUploader(this.api);

        _.merge(this.state, {
            cropImage: null,
            uploadPercentage: null,
            value: props.value
        });

        this.bindMethods('getTextareaElement,getEditor,getCropper,onCropperHidden,uploadImage,fileChanged,applyValue,changed,renderError');
    }

    componentDidMount() {
        super.componentDidMount();

        this.editor = new Quill(this.getTextareaElement(), {
            modules: {
                toolbar: this.props.toolbar
            },
            theme: 'snow',
            bounds: document.body
        });

        const toolbar = this.editor.getModule('toolbar');
        toolbar.addHandler('image', () => {
            this.refs.reader.getFiles();
        });

        this.editor.on('text-change', () => {
            this.setState({value: this.editor.root.innerHTML}, this.changed);
        });

        this.editor.pasteHTML(this.props.value);
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!this.delay && props.value !== this.editor.root.innerHTML) {
            this.editor.pasteHTML(props.value);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const oldState = _.pick(this.state, ['cropImage', 'uploadPercentage', 'error']);
        const newState = _.pick(nextState, ['cropImage', 'uploadPercentage', 'error']);
        return !_.isEqual(oldState, newState);
    }

    componentDidUpdate() {
        super.componentDidUpdate();
        this.editor.pasteHTML(this.state.value);
    }

    componentWillUnmount() {
        delete this.editor;
    }

    applyValue(value) {
        clearTimeout(this.delay);
        this.delay = null;
        this.props.onChange(value);
    }

    changed() {
        clearTimeout(this.delay);
        this.delay = null;
        this.delay = setTimeout(() => this.applyValue(this.state.value), 300);
    }

    fileChanged(file, error) {
        if (error) {
            this.setState({error});
            return;
        }

        this.setState({error: null});

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

    renderError() {
        let error = null;
        if (this.state.error) {
            error = (
                <Ui.Alert type="error">{this.state.error.message}</Ui.Alert>
            );
        }
        return error;
    }
}

HtmlEditor.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    imageApi: '/entities/core/images',
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 2485760,
    label: null,
    description: null,
    info: null,
    tooltip: null,
    toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block', 'link', 'image'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'size': ['small', false, 'large', 'huge']}],
        [{'header': [1, 2, 3, 4, 5, 6, false]}],
        [{'color': []}, {'background': []}],
        [{'font': []}],
        [{'align': []}],
        ['clean']
    ],
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
        if (this.state.uploadPercentage !== null) {
            uploader = (
                <div>
                    <strong>Your image is being uploaded...</strong>
                    <Ui.Progress value={this.state.uploadPercentage}/>
                </div>
            );
        }

        return (
            <div className="form-group">
                {this.renderLabel()}
                {this.renderInfo()}
                <div className="input-group">
                    {this.renderError()}
                    {uploader}
                    <div className="editor"></div>
                    <Ui.Files.FileReader
                        accept={this.props.accept}
                        ref="reader"
                        sizeLimit={this.props.sizeLimit}
                        onChange={this.fileChanged}/>
                    {this.getCropper(<Ui.Alert type="info" title="Hint">Scroll to zoom in/out</Ui.Alert>)}
                </div>
                {this.renderDescription()}
            </div>
        );
    }
});

export default HtmlEditor;

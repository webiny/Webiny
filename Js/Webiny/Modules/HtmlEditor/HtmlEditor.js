import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class HtmlEditor extends Webiny.Ui.FormComponent {
    constructor(props) {
        super(props);


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

        this.editor = null;
        this.delay = null;
        this.api = new Webiny.Api.Endpoint(props.imageApi);
        this.uploader = new Ui.Files.FileUploader(this.api);

        _.merge(this.state, {
            cropImage: null,
            uploadPercentage: null,
            value: props.valueLink.value
        });

        this.bindMethods('getTextareaElement,getEditor,getCropper,onCropperHidden,uploadImage,fileChanged,applyValue,changed,renderError');
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
            this.setState({value: this.editor.root.innerHTML}, this.changed);
        });

        this.editor.pasteHTML(this.props.valueLink.value);

        window.qe = this.editor;
    }

    componentWillReceiveProps(props) {
        super.componentWillReceiveProps(props);
        if (!this.delay && props.valueLink.value != this.editor.root.innerHTML) {
            this.editor.pasteHTML(props.valueLink.value);
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
        this.props.valueLink.requestChange(value);
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

HtmlEditor.defaultProps = {
    imageApi: '/entities/core/images',
    accept: ['image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
    sizeLimit: 2485760,
    label: null,
    description: null,
    info: null,
    tooltip: null,
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

        let label = null;
        if (this.props.label) {
            let tooltip = null;
            if (this.props.tooltip) {
                tooltip = <Ui.Tooltip target={<Ui.Icon icon="icon-info-circle"/>}>{this.props.tooltip}</Ui.Tooltip>;
            }
            label = <label className="control-label">{this.props.label} {tooltip}</label>;
        }

        let info = this.props.info;
        if (_.isFunction(info)) {
            info = info(this);
        }

        let description = this.props.description;
        if (_.isFunction(description)) {
            description = description(this);
        }

        return (
            <div className="form-group">
                {label}
                <span className="info-text">{info}</span>

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
                <span className="help-block">{description}</span>
            </div>
        );
    }
};

export default HtmlEditor;

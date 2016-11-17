import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class SimpleFile extends Webiny.Ui.FormComponent {

    constructor(props) {
        super(props);
        this.bindMethods('fileChanged,removeFile,getFiles');
    }

    fileChanged(file, error) {
        if (error) {
            this.setState({error});
            return;
        }

        if (_.has(file, 'src')) {
            file.id = _.get(this.props.value, 'id', this.lastId);
            this.props.onChange(file).then(this.validate);
        }
    }

    // TODO: add UI element (button or something) to be able to remove selected file
    removeFile(e) {
        e.stopPropagation();
        this.lastId = this.props.value && this.props.value.id || null;
        this.props.onChange(null);
    }

    getFiles(e) {
        this.setState({error: null});
        e.stopPropagation();
        this.refs.reader.getFiles();
    }
}

SimpleFile.defaultProps = _.merge({}, Webiny.Ui.FormComponent.defaultProps, {
    accept: [],
    sizeLimit: 2485760,
    readAs: 'data', // or binary
    renderer() {
        const fileReaderProps = {
            accept: this.props.accept,
            ref: 'reader',
            onChange: this.fileChanged,
            readAs: this.props.readAs,
            sizeLimit: this.props.sizeLimit
        };
        const fileReader = <Ui.Files.FileReader {...fileReaderProps}/>;

        const cssConfig = {
            'form-group': true,
            'error': this.state.isValid === false,
            'success': this.state.isValid === true
        };

        return (
            <div className={this.classSet(cssConfig, this.props.className)}>
                {this.renderLabel()}

                <div className="choose-file">
                    <input
                        type="text"
                        placeholder={this.props.placeholder}
                        readOnly={true}
                        onClick={this.getFiles}
                        className="form-control"
                        value={_.get(this.props.value, 'name', '')}
                        onChange={_.noop}/>

                    <div className="fileUpload btn" onClick={this.getFiles}>
                        <span>Upload</span>
                        {fileReader}
                    </div>
                    {this.renderDescription()}
                    <Webiny.Ui.Components.Animate
                        trigger={this.renderValidationMessage()}
                        show={this.props.showValidationAnimation}
                        hide={this.props.hideValidationAnimation}>
                        {this.renderValidationMessage()}
                    </Webiny.Ui.Components.Animate>
                </div>
            </div>
        );
    }
});

export default SimpleFile;
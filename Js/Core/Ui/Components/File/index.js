import Webiny from 'Webiny';
import styles from './styles.css';

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
        const {Animate, FileReader, FormGroup, styles} = this.props;

        const fileReaderProps = {
            accept: this.props.accept,
            ref: 'reader',
            onChange: this.fileChanged,
            readAs: this.props.readAs,
            sizeLimit: this.props.sizeLimit
        };
        const fileReader = <FileReader {...fileReaderProps}/>;

        return (
            <FormGroup valid={this.state.isValid} className={this.props.className}>
                {this.renderLabel()}

                <div className={styles.wrapper}>
                    <input
                        type="text"
                        placeholder={this.getPlaceholder()}
                        readOnly={true}
                        onClick={this.getFiles}
                        className={styles.input}
                        value={_.get(this.props.value, 'name', '')}
                        onChange={_.noop}/>

                    <div className={styles.uploadBtn} onClick={this.getFiles}>
                        <span>Upload</span>
                        {fileReader}
                    </div>
                    {this.renderDescription()}
                    <Animate
                        trigger={this.renderValidationMessage()}
                        show={this.props.showValidationAnimation}
                        hide={this.props.hideValidationAnimation}>
                        {this.renderValidationMessage()}
                    </Animate>
                </div>
            </FormGroup>
        );
    }
});

export default Webiny.createComponent(SimpleFile, {modules: ['Animate', 'FileReader', 'FormGroup'], styles});
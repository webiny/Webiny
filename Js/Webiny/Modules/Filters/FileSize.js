import Webiny from 'Webiny';

class FileSize extends Webiny.Ui.Component {

}

FileSize.defaultProps = {
    renderer() {
        const i = Math.floor(Math.log(this.props.value) / Math.log(1024));
        const result = (this.props.value / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];

        return (
            <span>{result}</span>
        );
    }
};


export default FileSize;

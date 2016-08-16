import Webiny from 'Webiny';

class ErrorCount extends Webiny.Ui.View {

    constructor(props) {
        super(props);

        this.state = {
            errorCount: this.props.count
        };
    }

}

ErrorCount.defaultProps = {
    renderer() {
        return <span className="badge badge-primary">{this.state.errorCount}</span>;
    }
};

export default ErrorCount;
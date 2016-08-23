import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class MultiAction extends Webiny.Ui.Component {
    constructor(props) {
        super(props);

        this.bindMethods('onAction');
    }

    onAction() {
        this.props.onAction(this.props.data, this.props.actions);
    }
}

MultiAction.defaultProps = {
    allowEmpty: false,
    onAction: _.noop,
    download: null,
    renderer() {
        if (!this.props.data.size && !this.props.allowEmpty) {
            return <Ui.Link onClick={_.noop}>{this.props.label}</Ui.Link>
        }

        if (this.props.download) {
            return (
                <Ui.DownloadLink download={this.props.download} data={this.props.data}>{this.props.label}</Ui.DownloadLink>
            );
        }

        return (
            <Ui.Link onClick={this.onAction}>{this.props.label}</Ui.Link>
        );
    }
};

export default MultiAction;
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Action extends Webiny.Ui.Component {

}

Action.defaultProps = {
    onClick: _.noop,
    download: null,
    renderer() {
        if (_.isFunction(this.props.children)) {
            return this.props.children.call(this, this.props.data, this);
        }

        if (this.props.download) {
            return (
                <Ui.DownloadLink download={this.props.download} data={this.props.data}>{this.props.label}</Ui.DownloadLink>
            );
        }

        return (
            <Ui.Link
                data={this.props.data}
                onClick={() => this.props.onClick.call(this, this.props.data, this)}>
                {this.props.label}
            </Ui.Link>
        );
    }
};

export default Action;
import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class Action extends Webiny.Ui.Component {

}

Action.defaultProps = {
    icon: null,
    onClick: _.noop,
    download: null,
    renderer() {
        if (_.isFunction(this.props.children)) {
            return this.props.children.call(this, this.props.data, this);
        }

        const icon = this.props.icon ? <Ui.Icon icon={this.props.icon}/> : null;

        if (this.props.download) {
            return (
                <Ui.DownloadLink download={this.props.download} data={this.props.data}>{icon} {this.props.label}</Ui.DownloadLink>
            );
        }

        return (
            <Ui.Link
                data={this.props.data}
                onClick={() => this.props.onClick.call(this, this.props.data, this)}>
                {icon} {this.props.label}
            </Ui.Link>
        );
    }
};

export default Action;
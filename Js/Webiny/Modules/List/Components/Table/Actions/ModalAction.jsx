import Webiny from 'Webiny';
const Ui = Webiny.Ui.Components;

class ModalAction extends Webiny.Ui.Component {
}

ModalAction.defaultProps = {
    hide: _.noop,
    download: false,
    renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const modalActions = {
            hide: () => {
                if (this.refs.dialog) {
                    return this.refs.dialog.hide();
                }
                return Q(true);
            }
        };

        const download = (httpMethod, url, ids = null, filters = null) => {
            this.refs.downloader.download(httpMethod, url, ids, filters);
            this.refs.dialog.hide();
        };
        const modal = this.props.children.call(this, this.props.data, this.props.actions, modalActions, download);

        return (
            <Ui.Link onClick={() => this.refs.dialog.show()}>
                {React.cloneElement(modal, {ref: 'dialog'})}
                {this.props.label}
                <Ui.Downloader ref="downloader"/>
            </Ui.Link>
        );
    }
};

export default ModalAction;
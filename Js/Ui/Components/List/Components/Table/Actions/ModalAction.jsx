import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';

class ModalAction extends Webiny.Ui.Component {
}

ModalAction.defaultProps = {
    hide: _.noop,
    download: false,
    renderer() {
        if (_.isFunction(this.props.hide) && this.props.hide(this.props.data)) {
            return null;
        }

        const {Icon, Link, Downloader} = this.props;

        const modalActions = {
            hide: () => {
                if (this.refs.dialog) {
                    return this.refs.dialog.hide();
                }
                return Promise.resolve(true);
            }
        };

        const download = (httpMethod, url, params = null) => {
            this.refs.downloader.download(httpMethod, url, params);
            this.refs.dialog.hide();
        };
        const modal = this.props.children.call(this, this.props.data, this.props.actions, modalActions, download);

        const icon = this.props.icon ? <Icon icon={this.props.icon}/> : null;

        return (
            <Link onClick={() => this.refs.dialog.show()}>
                {icon}
                {this.props.label}
                {React.cloneElement(modal, {ref: 'dialog'})}
                <Downloader ref="downloader"/>
            </Link>
        );
    }
};

export default Webiny.createComponent(ModalAction, {modules: ['Icon', 'Link', 'Downloader']});
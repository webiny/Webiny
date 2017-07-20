import React from 'react';
import _ from 'lodash';
import Webiny from 'Webiny';

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
        const {Link, DownloadLink} = this.props;

        if (!this.props.data.length && !this.props.allowEmpty) {
            return <Link onClick={_.noop}>{this.props.label}</Link>;
        }

        if (this.props.download) {
            return (
                <DownloadLink download={this.props.download} data={this.props.data}>{this.props.label}</DownloadLink>
            );
        }

        return (
            <Link onClick={this.onAction}>{this.props.label}</Link>
        );
    }
};

export default Webiny.createComponent(MultiAction, {modules: ['Link', 'DownloadLink']});
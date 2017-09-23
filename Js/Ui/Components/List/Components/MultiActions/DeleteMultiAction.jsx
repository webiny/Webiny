import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import ModalMultiAction from './ModalMultiAction';

class DeleteMultiAction extends Webiny.Ui.Component {

    constructor(props) {
        super(props);
        this.bindMethods('delete,formatMessage');
    }

    formatMessage() {
        const {message, data} = this.props;
        if (_.isFunction(message)) {
            return message({data});
        }
        return this.props.message.replace('{count}', this.props.data.length);
    }

    delete({data, actions, dialog}) {
        return this.props.actions.api.post('delete', {ids: _.map(data, 'id')}).then(res => {
            if (!res.isError()) {
                Webiny.Growl.success(data.length + ' records deleted successfully!');
                actions.reload();
            } else {
                Webiny.Growl.danger(res.getError(), 'Delete failed', true);
            }
            return dialog.hide();
        });
    }
}

DeleteMultiAction.defaultProps = {
    label: 'Delete',
    title: 'Delete confirmation',
    message: 'Do you really want to delete {count} record(s)?',
    actions: null,
    data: [],
    onConfirm(params) {
        return this.delete(params);
    },
    renderer() {
        const {Modal, actions, label, data, children} = this.props;

        const content = _.isFunction(children) ? children : ({data, actions, dialog}) => {
            const props = {
                title: this.props.title,
                message: this.formatMessage(),
                onConfirm: () => this.props.onConfirm.call(this, {data, actions, dialog})
            };
            return (
                <Modal.Confirmation {...props}/>
            );
        };

        return (
            <ModalMultiAction actions={actions} label={label} data={data}>
                {content}
            </ModalMultiAction>
        );
    }
};

export default Webiny.createComponent(DeleteMultiAction, {modules: ['Modal']});
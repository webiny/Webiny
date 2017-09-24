import React from 'react';
import _ from 'lodash';
import Webiny from 'webiny';
import ModalAction from './ModalAction';

class DeleteAction extends Webiny.Ui.Component {

}

DeleteAction.defaultProps = {
    label: 'Delete',
    title: 'Delete confirmation',
    icon: 'icon-cancel',
    message: 'Are you sure you want to delete this record?',
    confirmButtonLabel: 'Yes, delete!',
    cancelButtonLabel: 'No',
    hide: _.noop,
    afterDelete: _.noop,
    onConfirm({data, actions, dialog}) {
        return actions.delete(data.id, false).then(res => {
            return Promise.resolve(this.props.afterDelete(res)).then(() => res);
        });
    },
    renderer() {
        const {message, Modal} = this.props;
        const $this = this;

        return (
            <ModalAction {..._.pick(this.props, 'data', 'actions', 'label', 'hide', 'afterDelete', 'icon')}>
                {function render({data, actions, dialog}) {
                    const props = {
                        title: $this.props.title,
                        confirm: $this.props.confirmButtonLabel,
                        cancel: $this.props.cancelButtonLabel,
                        message,
                        onComplete: () => {
                            actions.reload();
                        },
                        onConfirm: () => {
                            $this.props.onConfirm.call($this, {data, actions, dialog});
                        }
                    };
                    return (
                        <Modal.Confirmation {...props}/>
                    );
                }}
            </ModalAction>
        );
    }
};

export default Webiny.createComponent(DeleteAction, {modules: ['Modal']});